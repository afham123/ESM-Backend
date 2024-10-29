export const Commenttypedef = `
    type Comment {
        _id: ID!
        name: String
        email: String
        user: User!
        movie: Movie!
        text: String
        date: String
    }
`