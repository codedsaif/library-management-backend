import { buildSchema } from "graphql";

export const schema = buildSchema(`

    # user schema
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

    input UserData {
        name: String!
        email: String!
        username: String
        pic: String
        role: String
        password: String!
        passwordConfirm:String!
    }

    input UpdateUserData{
        name:String
        email:String
        username:String
        pic:String
        role:String
    }

    type AuthData {
        user: User!
        token: String!
    }

    type Book {
        _id: ID!
        title: String!
        description: String
        author: String
        currentOwner: User
        createdBy: String!
        requests: [BookRequest!]
        createdAt: String!
        updatedAt: String!
    }

    input BookData {
        title: String!
        description: String
        author: String
        createdBy: String
    }

    type deleteMessage {
        status:String!,
        message:String
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
        hello: HelloWorld! # this is just testing function

        books(title:String): [Book]! # this function returns all books
        removeBook(id:String!):deleteMessage! # this function delete the book
        
        signin(email:String!, password:String!):AuthData! # this is login(signin in function)
        removeUser(id:String!):deleteMessage! # this function will removed the user from application
        users: [User]! # this query will return all users
    }
    
    type RootMutation {
        signup(userData: UserData): AuthData!
        updateUser(id: String!, updateUserData: UpdateUserData!): User!
        addBook(bookData: BookData): Book!
        updateBook(id:String!, bookData: BookData!): Book!
    }
    
    schema{
        query:RootQuery
        mutation:RootMutation
    }
`);
