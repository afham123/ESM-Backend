export const moviesTypedef = `
    type Award {
        wins: Int
        nomination: Int
        text: String
    }
    type IMDB {
        rating: String
        votes: Int
        id: ID!
    }
    type TomatoView {
        rating: Float
        numReviews: Int
        meter: Int
    }
    type Tomato {
        viewer: TomatoView
        critic: TomatoView
    }
    type Movie {
        _id: ID!
        plot: String!
        runtime: Int
        poster: String
        genres: [String]!
        cast: [String]!
        title: String
        fullplot: String
        language: [String]
        released: String
        directors: [String]
        rated: String
        awards: Award
        lastupdated: String
        year: Int
        imdb: IMDB
        countries: [String]
        type: String
        tomatoes: Tomato
        num_mflix_comments: Int 
    }
`