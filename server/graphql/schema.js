import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
    }
    type Book {
        _id: ID!
        title: String!
        createdAt: String!
        updatedAt: String!
        author: String!
    }

    type RootQuery {
        hello:String!
    }
    schema{
        query:RootQuery
    }
`);
