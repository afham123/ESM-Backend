import { ERROR_MESSAGES, STATUS_CODE, SUCCESS_MESSAGES } from '../../constant'
import { Router, Request, Response, NextFunction } from 'express';
import authMiddleware from '../../middleware/auth.midlleware';
import { Controller } from '../interface';
import { MongoService } from '../../services/Mongoservice';
import { errorMiddleware, successMiddleware } from '../../middleware/responseAPI.middleware';
import logger from '../../logger';
import MovieModel from '../movie/movie.model';
import UserModel from '../user/user.model';
import commentsModel from './comment.model';
import CommentValidation from './comment.validation';

class commentController implements Controller {
    public router = Router();
    public path = `/COMMENT`;
    private validation = new CommentValidation();  // need to change this.
    private User = UserModel;
    private movie = MovieModel
    private Comment = commentsModel

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(
            `${this.path}/createComment`,
            authMiddleware,
            this.validation.createCommentValidation(),
            this.createComment
        );

        this.router.post(
            `${this.path}/updateComment`,
            authMiddleware,
            this.validation.updateCommmentValidation(),
            this.updateComment
        );
        this.router.post(
            `${this.path}/deleteComment`,
            authMiddleware,
            this.validation.deleteCommentValidation(),
            this.deleteComment
        );
    }

    private updateComment = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id, text } = request.body;

            const Commment = await MongoService.findOne(this.Comment, {
                query: { _id: id }
            });

            let updatedCommment;
            if (!Commment) {
                response.statusCode = STATUS_CODE.BAD_REQUEST;
                throw new Error(
                    ERROR_MESSAGES.COMMON.NOT_EXISTS.replace(':attribute', 'Commment')
                );
            }

            else {
                updatedCommment = await MongoService.findOneAndUpdate(this.Comment, {
                    query: { _id: id },
                    updateData: {text}
                })
            };

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.UPDATE_SUCCESS.replace(':attribute', 'Comment'),
                    data: updatedCommment
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue into updating an user Comment: ${error}`);
            return next(error);
        }
    }

    private createComment = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            let { user_id, movie_id } = request.body;

            const User = await MongoService.findOne(this.User, {
                query: { _id:user_id }
            });
            const Movie = await MongoService.findOne(this.movie, {
                query : {_id:movie_id}
            })
            if (User) {
                errorMiddleware(
                    {
                        message: ERROR_MESSAGES.COMMON.ALREADY_EXISTS.replace(':attribute', 'user'),
                    },
                    request,
                    response,
                    next
                );
            }
            if (Movie) {
                errorMiddleware(
                    {
                        message: ERROR_MESSAGES.COMMON.ALREADY_EXISTS.replace(':attribute', 'Movie'),
                    },
                    request,
                    response,
                    next
                );
            }
            let data = request.body;
            data.name = User.name;
            data.email = User.email;
            data.date = Date.now()

            const commentDoc = await MongoService.create(this.Comment, { 
                insert: data
            });

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.CREATE_SUCCESS.replace(':attribute', 'Comment'),
                    data: commentDoc
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue in creating Comment: ${error}`);
            return next(error);
        }
    }

    private deleteComment = async (
        request: Request,
        response: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = request.body;

            const comment = await MongoService.findOne(this.Comment, {
                query: { _id: id }
            });
            if (!comment) {
                errorMiddleware(
                    {
                        message: ERROR_MESSAGES.COMMON.NOT_EXISTS.replace(':attribute', 'comment'),
                    },
                    request,
                    response,
                    next
                );
            }

            const deletedComment = await MongoService.findByIdAndDelete(this.Comment, {
                query: { _id: id }
            })

            successMiddleware(
                {
                    message: SUCCESS_MESSAGES.COMMON.DELETE_SUCCESS.replace(':attribute', 'Comment'),
                    data: { deletedComment }
                },
                request,
                response,
                next
            );

        } catch (error) {
            logger.error(`There was an issue in deleting comment.: ${error}`);
            return next(error);
        }
    }
}

export default commentController;