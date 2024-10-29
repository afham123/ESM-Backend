import { MongoService } from "../../../services/Mongoservice";
import { Comment as commentIf } from "../../comment/comment.interface";
import MovieModel from "../../movie/movie.model";
import UserModel from "../../user/user.model";

export const Comment = {
    async movie(parent:commentIf){
        const {movie_id} = parent;
        const data = await MongoService.findOne(MovieModel, {
            query: {_id:movie_id}
        }) 
        return data;
    },
    async user(parent:commentIf){
        const {user_id} = parent;
        const data = await MongoService.findOne(UserModel, {
            query: {_id:user_id}
        }) 
        return data;
    }
}