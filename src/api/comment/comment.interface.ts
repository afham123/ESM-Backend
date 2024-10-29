import { Types } from "mongoose";

export interface Comment {
    _id: Types.ObjectId
    name: String,
    email: String,
    movie_id: String,
    text: String,
    date: Date,
    user_id : Types.ObjectId
}