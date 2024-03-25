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
        books:[SecondLevelBooks]
        createdAt: String!
        updatedAt: String!
    }

    type SecondLevelBooks{
        _id: ID!
        title: String!
        description: String
        author: String
        currentOwner: SecondLevelUser
        createdBy: SecondLevelUser
        pendingBorrowRequests:[SecondLevelUser]
        createdAt: String!
        updatedAt: String!
    }

    type SecondLevelUser {
        _id: ID!
        name: String!
        username: String
        pic: String
        role: String
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
        currentOwner: SecondLevelUser
        createdBy: SecondLevelUser
        pendingBorrowRequests:[SecondLevelUser]
        createdAt: String!
        updatedAt: String!
    }

    input BookData {
        title: String!
        description: String
        author: String
        createdBy: String
    }

    type BorrowBook {
        message: String!
        book: Book
    }

    type removeMessage {
        status:String!,
        message:String
    }

    type HelloWorld {
        message: String!
        count: String
    }
        
    type RootQuery {
        hello: HelloWorld! # this is just testing function

        books(title:String): [Book]! # this function returns all books
        removeBook(id:String!):removeMessage! # this function delete the book
        
        signin(email:String!, password:String!):AuthData! # this is login(signin in function)
        removeUser(id:String!):removeMessage! # this function will removed the user from application
        users: [User]! # this query will return all users
        borrowBook(id:String!): BorrowBook!
        transferBook(id:String!):BorrowBook!
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
