import mongoose, { connect, ConnectOptions } from 'mongoose';
import logger from '../logger';

class MongoBot {
    async init(): Promise<void> {
        try {
            const MONGO_SRV = process.env.MONGO_SRV;
            logger.info('connecting to MongoDB... MONGO_SRV : ', MONGO_SRV);
            mongoose.set("strictQuery", false);
            await connect(`${MONGO_SRV}`, {
            } as ConnectOptions);
        } catch (err: any) {
            console.log('Failed to connect to the MongoDB', err.message);
            throw new Error(`Failed to connect to the MongoDB ${err.message}`);
        }
    }
}

export default new MongoBot();