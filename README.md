# library-management-backend [Live](https://library-management-backend-7w6d.onrender.com/graphql)

- This Node.js application with a GraphQL API serves as a Book Management System, enabling users to manage books, users, and authentication securely. It includes features for CRUD operations on books and users, authentication with JWT, and additional functionalities such as browsing, searching, borrowing, and buying books.

## Book Management:

1. CRUD operations for books (Create, Read, Update, Delete) by roles.
2. Browsing and searching available books for users.
   Borrowing or buying books for users.
3. User-to-user book borrowing requests (optional).

## User Management:

1. User registration, login with JWT authentication.
2. Role-based access control (admin and regular user).

## Technologies Used

1. Node.js
2. Express
3. GraphQL
4. MongoDb
5. Mongoose
6. JWT (authentication)

## All Functionality in Details

## Users

1. User can create account as registered ( signup ) with jsonwebtoken
2. User can access their account (signin) with jsonwebtoken
3. User can update their account but can't update their role. (Admin can update anyone account and also update their role)
4. Admin can access all applications users

## Books

1. Admin can create book.
2. Admin can remove book.
3. Admin can update book.
4. Anyone can see all books
5. Anyone can search a book by title
6. User can make request for borrow book
7. Only one user can borrow a book at once. Else everyone added in waiting queue.
