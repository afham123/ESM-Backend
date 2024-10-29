import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '../../constant'
import { Router, Request, Response, NextFunction } from 'express';
import UserValidation from './user.validation';
import UserModel from './user.model';
import authMiddleware from '../../middleware/auth.midlleware';
import { Controller, RequestWithUser } from '../interface';
import { MongoService } from '../../services/Mongoservice';
import { errorMiddleware, successMiddleware } from '../../middleware/responseAPI.middleware';
import genToken, { genMFACode } from '../../services/util';
import logger from '../../logger';
import { sendEmail } from '../../services/nodemail';
const SuperAdmin_Mail = process.env.SuperAdmin_Mail || ''

class userController implements Controller {
    public router = Router();
    public path = `/USER`;
    private validation = new UserValidation();
    private User = UserModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(
            `${this.path}/createUser`,
            authMiddleware,
            this.validation.createUserProfile(),
            this.createUserProfile
        );

        this.router.post(
            `${this.path}/getUserProfile`,
            authMiddleware,
            this.validation.getUserProfileValidation(),
            this.getUserProfile
        );
        this.router.post(
            `${this.path}/verify_mfa`,
            authMiddleware,
            this.validation.getverify_MFAValidation(),
            this.verify_MFA
        );
        this.router.post(
            `${this.path}/updateProfile`,
            authMiddleware,
            this.validation.updateUserProfileValidation(),
            this.updateUserProfile
        );
        this.router.post(
            `${this.path}/deleteUser`,
            authMiddleware,
            this.validation.deleteUserProfileValidation(),
            this.deleteUserProfile
        );
    }

    private getUserProfile = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { email, password } = request.body;

            let userDoc = await MongoService.findOne(this.User, {
                query: { email, password }
            });
            logger.info('userDoc',userDoc)

            if (!userDoc) {
                return errorMiddleware(
                    {
                        message: ERROR_MESSAGES.INCORRECT_CREDENTIAL
                    },
                    request,
                    response,
                    next
                )
            }
            const _id = userDoc._id;
            const token = await genToken({ _id });
            const MFA_Code = genMFACode() + '';

            await MongoService.findOneAndUpdate(this.User, {
                query: { _id },
                updateData: { MFA_Code, token }
            })
            // sendEmail(MFA_Code, SuperAdmin_Mail)
            
            return successMiddleware(
                {
                    message: SUCCESS_MESSAGES.MFA_CODE_SUCCESS,
                    data: token
                },
                request,
                response,
                next
            );
        } catch (error) {
            logger.error(`There was an issue into fetching user profile.: ${error}`);
            return next(error);
        }
    }
    
    private verify_MFA = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { email, password, MFA_Code } = request.body;

            let userDoc = await MongoService.findOne(this.User, {
                query: { email, password, MFA_Code }
            });

            if (!userDoc) {
                return errorMiddleware(
                    {
                        message: ERROR_MESSAGES.INCORRECT_CREDENTIAL_MFA
                    },
                    request,
                    response,
                    next
                )
            }
            const _id = userDoc._id;
            const token = await genToken({ _id });

            await MongoService.findOneAndUpdate(this.User, {
                query: { _id },
                updateData: { token }
            })
            
            return successMiddleware(
                {
                    message: SUCCESS_MESSAGES.MFA_CODE_SUCCESS,
                    data: token
                },
                request,
                response,
                next
            );
        } catch (error) {
            logger.error(`There was an issue in verifying MFA: ${error}`);
            return next(error);
        }
    }

    private updateUserProfile = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const req = request as RequestWithUser;
            const { userId } = request.body;
            const User = req.body;

            const user = await MongoService.findOne(this.User, {
                query: { _id: userId }
            });

            let updatedUser;
            if (!user) {
                response.statusCode = STATUS_CODE.BAD_REQUEST;
                throw new Error(
                    ERROR_MESSAGES.COMMON.NOT_EXISTS.replace(':attribute', 'user')
                );
            }

            else {
                updatedUser = await MongoService.findOneAndUpdate(this.User, {
                    query: { _id: userId },
                    updateData: User
                })
            };

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.UPDATE_SUCCESS.replace(':attribute', 'Profile'),
                    data: updatedUser
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue into updating an user profile updateUserProfile.: ${error}`);
            return next(error);
        }
    }
    private makeid = (length: number) => {
        let result = '', characters;
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    private createUserProfile = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            let { email } = request.body;
            const user = request.body;

            const User = await MongoService.findOne(this.User, {
                query: { email }
            });
            if (User) {
                errorMiddleware(
                    {
                        message: ERROR_MESSAGES.COMMON.ALREADY_EXISTS.replace(':attribute', 'email'),
                    },
                    request,
                    response,
                    next
                );
            }

            const userDoc = await MongoService.create(this.User, { insert: user });
            const _id = userDoc._id;
            const token = await genToken({ _id });

            const updatedUser = await MongoService.findOneAndUpdate(this.User, {
                query: { _id },
                updateData: { ...User, token }
            })

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.CREATE_SUCCESS.replace(':attribute', 'User Profile'),
                    data: updatedUser
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue in creating user profile.: ${error}`);
            return next(error);
        }
    }



    private deleteUserProfile = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { userId } = request.body;

            const user = await MongoService.findOne(this.User, {
                query: { _id: userId }
            });
            if (!user) {
                errorMiddleware(
                    {
                        message: ERROR_MESSAGES.COMMON.NOT_EXISTS.replace(':attribute', userId),
                    },
                    request,
                    response,
                    next
                );
            }

            const deletedUser = await MongoService.findByIdAndDelete(this.User, {
                query: { _id: userId }
            })

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.DELETE_SUCCESS.replace(':attribute', userId),
                    data: { deletedUser }
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue in creating user profile.: ${error}`);
            return next(error);
        }
    }
}

export default userController;