import { ERROR_MESSAGES } from '../constant';
import UserModel from '../api/user/user.model';
import { MongoService } from '../services/Mongoservice';
import { decryptUserId } from './auth.midlleware';
import logger from '../logger';

async function gqlAuth(token: string
): Promise<Boolean> {
    try {
        const _id = decryptUserId(token);
        const user = await MongoService.findOne(UserModel, {
            query: { _id }
        });
        if (!user)  throw new Error(ERROR_MESSAGES.TOKEN_EXPIRED);
        return true;
    }
    catch (error:any) {
        logger.error("Invalid or expired token:", error);
        return false;
    }
}

export default gqlAuth;