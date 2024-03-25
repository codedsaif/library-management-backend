# library-management-backend [Live](https://library-management-backend-7w6d.onrender.com/graphql)

- This Node.js application with a GraphQL API serves as a Book Management System, enabling users to manage books, users, and authentication securely. It includes features for CRUD operations on books and users, authentication with JWT, and additional functionalities such as browsing, searching, borrowing, and buying books.

## Key Features:

### Book Management:

1. CRUD Operations: Perform Create, Read, Update, and Delete operations on books based on user roles.
2. Browsing and Searching: Users can explore available books and search for specific titles.
3. Borrowing : Facilitate the borrowing of books by users.
4. User-to-User Interaction: Optionally allow users to request book borrowing from other users.

### User Management:

1. Authentication: User registration and login using JWT authentication for secure access.
2. User can update their account but can't update their role. (Admin can update anyone account and also update their role)
3. Role-Based Access Control: Administrators have privileged access compared to registered users.

### Technologies Used:

1. Node.js
2. Express
3. GraphQL
4. MongoDB
5. Mongoose
6. JWT (JSON Web Tokens) for authentication

## Detailed Functionality:

### Users:

1. User Registration: Users can create accounts and obtain JWT tokens for authentication.
2. User Authentication: Users can log in securely using their JWT tokens.
3. Account Updates: Users can update their account information, excluding their role. Administrators have the authority to update any user account, including roles.
4. Admin Access: Administrators have access to all user accounts within the application.

### Books:

1. Book Creation: Administrators can add new books to the system.
2. Book Removal: Administrators can remove books from the database.
3. Book Updates: Administrators can update book details as needed.
4. Book Viewing: All users can view the entire collection of books.
5. Book Searching: Users can search for books by title.
6. Book Borrowing Requests: Users can request to borrow books from others.
7. Borrowing Limits: Only one user can borrow a book at a time. Additional users are placed in a waiting queue.

### Advanced Functionality:

1. Admin Insights: Administrators can access comprehensive data including all users, their borrowed books, and pending book borrowing requests.
2. User Insights: Users can view detailed information about books, including the current owner, creator, and pending book borrowing requests.
