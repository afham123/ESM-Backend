import { NextFunction, Response, Request } from 'express';
import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { ERROR_MESSAGES, STATUS_CODE } from '../constant';
import { RequestWithUser } from '../api/interface';
import UserModel from '../api/user/user.model';
import { MongoService } from '../services/Mongoservice';
const JWT_SECRET = process.env.JWT_SECRET;
import type { JwtPayload } from "jsonwebtoken"
import logger from '../logger';

async function authMiddleware(
    request: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const User = UserModel;
        const req = request as RequestWithUser;
        const authHeader = req.headers.authorization as string;
        const {originalUrl} = req;
        logger.info('req.originalUrl', req.originalUrl); 

        if (originalUrl !== '/USER/getUserProfile' && originalUrl !== '/USER/createUser' && originalUrl !== "/USER/verify_mfa") {
            const _id = decryptUserId(authHeader);
            const user = await MongoService.findOne(User, {
                query: { _id }
            });
            if (!user) {
                res.statusCode = STATUS_CODE.FORBIDDEN;
                throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
            }
            if (user.isBlock) {
                res.statusCode = STATUS_CODE.UNAUTHORIZED;
                throw new Error(ERROR_MESSAGES.BLOCKED_USER);
            }

            // if (authHeader != user.token) {
            //     res.statusCode = STATUS_CODE.FORBIDDEN;
            //     throw new Error(ERROR_MESSAGES.ALREADY_LOGIN);
            // }
            req.user = user;
        }

        const secretKey = request.headers['api_secret_key'];  // 
        const secretData = request.headers['api_secret_data'];

        const API_SECRET_KEY = process.env.API_SECRET_KEY;
        const API_SECRET_DATA = process.env.API_SECRET_DATA

        if (API_SECRET_KEY && API_SECRET_DATA) {
            if (API_SECRET_KEY != secretKey || API_SECRET_DATA != secretData) {
                res.statusCode = STATUS_CODE.UNAUTHORIZED;
                throw new Error(ERROR_MESSAGES.NOT_ACCESS);
            }
        }

        next();
        // return true;
    }
    catch (err) {
        next(err)
        // return false;
    }
}

export function decryptUserId(authHeader: string) {
    const secret = JWT_SECRET ?? "";
    const verificationResponse = jwt.verify(
        authHeader,
        secret
    ) as JwtPayload;
    return verificationResponse._id;
}

export default authMiddleware;