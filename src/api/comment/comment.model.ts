import {Schema, model, Types}  from 'mongoose';
import { Comment } from './comment.interface';

const commentsSchema = new Schema({
    name: String,
    email: String,
    movie_id: String,
    text: String,
    date: Date,
    user_id : Types.ObjectId
});

const commentsModel = model<Comment & Document>('comment', commentsSchema);
export default commentsModel;