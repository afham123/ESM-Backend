import { Types }  from 'mongoose';
export interface TomatoView{
    rating: Number,
    numReviews: Number,
    meter: Number
    }

export interface Movie{
    _id: Types.ObjectId
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
        viewer: TomatoView,
        critic: TomatoView
    },
    num_mflix_comments: Number 
}