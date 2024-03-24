import { buildSchema } from "graphql";

export const schema = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        username: String
        pic: String
        role: String
        password: String
        books:[Book!]!
        createdAt: String!
        updatedAt: String!
    }
    type Book {
        _id: ID!
        title: String!
        description: String!
        author: String!
        currentOwner: User
        createdBy: String!
        requests: [BookRequest!]!
        createdAt: String!
        updatedAt: String!
    }

    input UserData {
        name: String!
        email: String!
        username: String
        pic: String
        role: String
        password: String!
        passwordConfirm:String!
    }

    type AuthData {
        user: User!
        token: String!
    }

    input BookData {
        title: String!
        description: String
        author: String
        createdBy: String
    }

    type BookRequest {
        id: ID!
        user: User!
        requestDate: String!
        approved: Boolean!
    }

    type HelloWorld {
        message: String!
        count: String
        helloWithHello: HelloWithHello!
    }
    
    type HelloWithHello {
        message: String!
    }
        
    type RootQuery {
        hello: HelloWorld!
        users: [User]!
        signin(email:String!, password:String!):AuthData!
        books: [Book]!
    }
    
    type RootMutation {
        signup(userData: UserData): AuthData!
        addBook(bookData: BookData): Book!
    }

    schema{
        query:RootQuery
        mutation:RootMutation
    }
`);
