export const query = `
    type Query {
        movies(skip: Int, limit: Int): [Movie]
        movie(id: ID!): Movie
        comments(skip: Int, limit: Int): [Comment]
        comment(id: ID!): Comment
        users(skip:Int, limit: Int): [User]
        user(id: ID!): User
        items(skip: Int, limit: Int, searchQuery: String, scroll_id: String, AdvanceQuery: AdvanceQueryInput, token: String): QueryResponse
        item(id: ID!, token: String): Item
        totalItem: Int
    }
    type QueryResponse {
        data : [Item]
        totalDocs : Int
        scroll_id : String
        message : String
        success : Boolean
    }
    type Mutation {
        addComment(comment: AddCommentInput!): responseMsg
        addItem(item: AddItemInput!, token: String): responseMsg
        deleteItem(ids: [ID!], token: String): responseMsg
        uploadItems(Items : [AddItemInput]!, token: String): responseMsg
    }
    type responseMsg{
        success : Boolean!
        msg : String
    }
    input AdvanceQueryInput{
        company : String
        name : String
        MatchPhrase : String
    }
    input AddCommentInput{
        user_id: ID!
        movie_id: ID!
        text: String
        date: String
        name: String
        email: String
    }
    input AddItemInput{
        name: String!
        category : String!
        company: String!
        contact_num : String!
        email: String!
        location: String
        GST_No: String
        GST_Turnover: String
        Remark: String
        Supplier_Type: String
        EnqDate: String
        status: String
        _id: String
    }
`