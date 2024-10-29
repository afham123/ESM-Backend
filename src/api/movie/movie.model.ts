import {Schema, model, Types}  from 'mongoose';
import { Movie } from './movie.interface';

const TomatoViewSchema = new Schema({
    rating: Number,
    numReviews: Number,
    meter: Number
    }
)

const movieSchema = new Schema({
        plot: {
            type : String
        },
        runtime: Number,
        poster: String,
        genres: [String],
        cast: [String],
        title: String,
        fullplot: String,
        language: [String],
        released: String,
        directors: [String],
        rated: String,
        awards: {
            wins: Number,
            nomination: Number,
            text: String
        },
        lastupdated: String,
        year: Number,
        imdb: {
            rating: String,
            votes: Number,
            id: Types.ObjectId,
        },
        contries: [String],
        type: String,
        tomatoes: {
            viewer: TomatoViewSchema,
            critic: TomatoViewSchema
        },
        num_mflix_comments: Number 
    }
)

const MovieModel = model<Movie & Document>('movie', movieSchema);
export default MovieModel;