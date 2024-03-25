# Please Note

- Please be aware that at the time of creating this documentation, the dataset may be limited. However, the beauty of our system truly shines when we have abundant data in our database.

```
About me
- Name: Saif
- Email: saifali27906@gmail.com
- Phone: +916397727906
```

1. [Testing](#testing)
2. [All books](#all-books)
3. [Add Book](#add-book-only-by-admin)
4. [Update Book](#update-book-only-admin-can-update)
5. [Remove Book](#remove-book-only-by-admin)
6. [Borrow Book](#borrow-book-if-available-then-become-owner-or-added-in-pendingborrowrequests-list)
7. [Transfer Book](#transfer-borrow-request-if-pending-list-have-request-then-next-guy-become-owner-else-no-one)
8. [Sing Up](#sign-up-register-role-registered-cant-change)
9. [Sing In](#sign-in-login)
10. [Remove User](#remove-user-only-self-or-admin-can-remove)
11. [All Users](#all-users-only-admin-can-see)

### TESTING

```
<=== QUERY ====>
query Hello {
    hello {
        message
        count
    }
}
<=== RESPONSE ====>
{
    "data": {
        "hello": {
            "message": "Hi Saif",
            "count": "35000"
        }
    }
}
```

### ALL BOOKS

```
<=== QUERY ====>
query Books {
    books(title: "") {
        _id
        title
        description
        author
        createdAt
        updatedAt
        currentOwner {
            _id
            name
            username
            pic
            role
        }
        createdBy {
            _id
            name
            username
            pic
            role
        }
        pendingBorrowRequests {
            _id
            name
            username
            pic
            role
        }
    }
}

<=== RESPONSE ====>
{
    "data": {
        "books": [
            {
                "_id": "6600f92a77212a5e1400dc8e",
                "title": "Development",
                "description": null,
                "author": null,
                "createdAt": "1711339818996",
                "updatedAt": "1711354082324",
                "currentOwner": {
                    "_id": "66002d57f2dedc44f31be910",
                    "name": "Ali",
                    "username": "saif",
                    "pic": "https://source.unsplash.com/100x100/?portrait",
                    "role": "admin"
                },
                "createdBy": {
                    "_id": "66002d57f2dedc44f31be910",
                    "name": "Ali",
                    "username": "saif",
                    "pic": "https://source.unsplash.com/100x100/?portrait",
                    "role": "admin"
                },
                "pendingBorrowRequests": [
                    {
                        "_id": "66002784b8f9358edb63cf46",
                        "name": "Ali",
                        "username": "ali",
                        "pic": "https://source.unsplash.com/100x100/?portrait",
                        "role": "subscriber"
                    }
                ]
            },
        ]
    }
}
```

### ADD BOOK (Only by admin)

```
<=== QUERY ====>
mutation AddBook {
    addBook(
        bookData: {
            title: "Testing Book Title"
            description: "Testing Book Description"
            author: "Saif"
        }
    ) {
        _id
        title
        description
        author
        createdAt
        updatedAt
        currentOwner {
            _id
            name
            username
            pic
            role
        }
        createdBy {
            _id
            name
            username
            pic
            role
        }
        pendingBorrowRequests {
            _id
            name
            username
            pic
            role
        }
    }
}

<=== RESPONSE ====>
{
    "data": {
        "addBook": {
            "_id": "660185748fee56943145dce2",
            "title": "Testing Book Title",
            "description": "Testing Book Description",
            "author": "Saif",
            "createdAt": "2024-03-25T14:08:52.251Z",
            "updatedAt": "2024-03-25T14:08:52.251Z",
            "currentOwner": null,
            "createdBy": {
                "_id": "66002d57f2dedc44f31be910",
                "name": "Ali",
                "username": "saif",
                "pic": "https://source.unsplash.com/100x100/?portrait",
                "role": "admin"
            },
            "pendingBorrowRequests": []
        }
    }
}
```

### REMOVE BOOK (Only by admin)

```
<=== QUERY ====>
query RemoveBook {
    removeBook(id: "660185748fee56943145dce2") {
        status
        message
    }
}

<=== RESPONSE ====>
{
    "data": {
        "removeBook": {
            "status": "success",
            "message": "book deleted successfully"
        }
    }
}
```

### SIGN UP (Register) (role registered) can't change

```
<=== QUERY ====>
mutation Signup {
    signup(
        userData: {
            name: "Tester"
            email: "tester@gmail.com"
            username: "tester"
            pic: "image url"
            role: "register"
            password: "custom1234"
            passwordConfirm: "custom1234"
        }
    ) {
        token
        user {
            _id
            name
            email
            username
            pic
            role
            createdAt
            updatedAt
            books {
                _id
                title
                description
                author
                createdAt
                updatedAt
                currentOwner {
                    _id
                    name
                    username
                    pic
                    role
                }
                createdBy {
                    _id
                    name
                    username
                    pic
                    role
                }
                pendingBorrowRequests {
                    _id
                    name
                    username
                    pic
                    role
                }
            }
        }
    }
}

<=== RESPONSE ====>
{
    "data": {
        "signup": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDE4NzBlOGZlZTU2OTQzMTQ1ZGNlOSIsImlhdCI6MTcxMTM3NjE0NSwiZXhwIjoxNzExOTgwOTQ1fQ.MQ1CNbo2STtBMugyqIpC-eaPvT2uqhDmPJAKxvbasSk",
            "user": {
                "_id": "6601870e8fee56943145dce9",
                "name": "Tester",
                "email": "tester@gmail.com",
                "username": "tester",
                "pic": "https://source.unsplash.com/100x100/?portrait",
                "role": "registered",
                "createdAt": "1711376142532",
                "updatedAt": "1711376142532",
                "books": null
            }
        }
    }
}

```

### UPDATE USER (Only self or admin can do {role only admin can change})

```
<=== QUERY ====>
mutation UpdateUser {
    updateUser(
        id: "6601870e8fee56943145dce9"
        updateUserData: {
            name: "verified tester "
            email: "verifiedtester@gmail.com"
            username: "verifiedtester"
            pic: "new image url"
            role: "admin"
        }
    ) {
        _id
        name
        email
        username
        pic
        role
        createdAt
        updatedAt
        books {
            _id
            title
            description
            author
            createdAt
            updatedAt
            currentOwner {
                _id
                name
                username
                pic
                role
            }
            createdBy {
                _id
                name
                username
                pic
                role
            }
            pendingBorrowRequests {
                _id
                name
                username
                pic
                role
            }
        }
    }
}


<=== RESPONSE ====>
{
    "data": {
        "updateUser": {
            "_id": "6601870e8fee56943145dce9",
            "name": "verified tester",
            "email": "verifiedtester@gmail.com",
            "username": "verifiedtester",
            "pic": "new image url",
            "role": "admin",
            "createdAt": "1711376142532",
            "updatedAt": "1711376450340",
            "books": []
        }
    }
}
```

### SIGN IN (login)

```
<=== QUERY ====>
query Signin {
    signin(email: "verifiedtester@gmail.com", password: "custom1234") {
        token
        user {
            _id
            name
            email
            username
            pic
            role
            createdAt
            updatedAt
            books {
                _id
                title
                description
                author
                createdAt
                updatedAt
                currentOwner {
                    _id
                    name
                    username
                    pic
                    role
                }
                createdBy {
                    _id
                    name
                    username
                    pic
                    role
                }
                pendingBorrowRequests {
                    _id
                    name
                    username
                    pic
                    role
                }
            }
        }
    }
}


<=== RESPONSE ====>
{
    "data": {
        "signin": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDE4NzBlOGZlZTU2OTQzMTQ1ZGNlOSIsImlhdCI6MTcxMTM3NjU3OSwiZXhwIjoxNzExOTgxMzc5fQ.fkF7bn6N9R7lR1dFCfjawAV7XBznD_Fs_UY1EfD5j58",
            "user": {
                "_id": "6601870e8fee56943145dce9",
                "name": "verified tester",
                "email": "verifiedtester@gmail.com",
                "username": "verifiedtester",
                "pic": "new image url",
                "role": "admin",
                "createdAt": "1711376142532",
                "updatedAt": "1711376450340",
                "books": []
            }
        }
    }
}
```

### REMOVE USER (Only self or Admin can remove)

```
<=== QUERY ====>
query RemoveUser {
    removeUser(id: "6601870e8fee56943145dce9") {
        status
        message
    }
}

<=== RESPONSE ====>
{
    "data": {
        "removeUser": {
            "status": "success",
            "message": "User removed successfully"
        }
    }
}
```

### BORROW BOOK (if available then become owner or added in pendingBorrowRequests list)

```
<=== QUERY ====>
query BorrowBook {
    borrowBook(id: "6600f8d6e0d1523aea30d653") {
        message
        book {
            _id
            title
            description
            author
            createdAt
            updatedAt
            currentOwner {
                _id
                name
                username
                pic
                role
            }
            createdBy {
                _id
                name
                username
                pic
                role
            }
            pendingBorrowRequests {
                _id
                name
                username
                pic
                role
            }
        }
    }
}
<=== RESPONSE ====>
{
     "data": {
        "borrowBook": {
            "message": "Now it's your book Ali",
            "book": {
                "_id": "6600f91f77212a5e1400dc8a",
                "title": "Of Self",
                "description": null,
                "author": null,
                "createdAt": "1711339807798",
                "updatedAt": "1711376822974",
                "currentOwner": null,
                "createdBy": {
                    "_id": "66002d57f2dedc44f31be910",
                    "name": "Ali",
                    "username": "saif",
                    "pic": "https://source.unsplash.com/100x100/?portrait",
                    "role": "admin"
                },
                "pendingBorrowRequests": []
            }
        }
    }
}
```

### TRANSFER BORROW REQUEST (if pending list have request then next guy become owner else no one)

```
<=== QUERY ====>
query TransferBook {
    transferBook(id: "6600f91f77212a5e1400dc8a") {
        message
        book {
            _id
            title
            description
            author
            createdAt
            updatedAt
            currentOwner {
                _id
                name
                username
                pic
                role
            }
            createdBy {
                _id
                name
                username
                pic
                role
            }
            pendingBorrowRequests {
                _id
                name
                username
                pic
                role
            }
        }
    }
}

<=== RESPONSE ====>
{
    "data": {
        "transferBook": {
            "message": "Request made Successfully Ali. Please wait...",
            "book": {
                "_id": "6600f91f77212a5e1400dc8a",
                "title": "Of Self",
                "description": null,
                "author": null,
                "createdAt": "1711339807798",
                "updatedAt": "1711376983734",
                "currentOwner": null,
                "createdBy": {
                    "_id": "66002d57f2dedc44f31be910",
                    "name": "Ali",
                    "username": "saif",
                    "pic": "https://source.unsplash.com/100x100/?portrait",
                    "role": "admin"
                },
                "pendingBorrowRequests": []
            }
        }
    }
}
```

### UPDATE BOOK (Only admin can update)

```
<=== QUERY ====>
mutation UpdateBook {
    updateBook(
        id: "6600f91f77212a5e1400dc8a"
        bookData: {
            title: "Updated Title"
            description: "Updated Des"
            author: "Updated Author"
        }
    ) {
        _id
        title
        description
        author
        createdAt
        updatedAt
        currentOwner {
            _id
            name
            username
            pic
            role
        }
        createdBy {
            _id
            name
            username
            pic
            role
        }
        pendingBorrowRequests {
            _id
            name
            username
            pic
            role
        }
    }
}

<=== RESPONSE ====>
{
    "data": {
        "updateBook": {
            "_id": "6600f91f77212a5e1400dc8a",
            "title": "Updated Title",
            "description": "Updated Des",
            "author": "Updated Author",
            "createdAt": "1711339807798",
            "updatedAt": "1711377148677",
            "currentOwner": null,
            "createdBy": {
                "_id": "66002d57f2dedc44f31be910",
                "name": "Ali",
                "username": "saif",
                "pic": "https://source.unsplash.com/100x100/?portrait",
                "role": "admin"
            },
            "pendingBorrowRequests": []
        }
    }
}
```

### ALL USERS (only admin can see)

```
<=== QUERY ====>
query Users {
    users {
        _id
        name
        email
        username
        pic
        role
        createdAt
        updatedAt
        books {
            _id
            title
            description
            author
            createdAt
            updatedAt
            currentOwner {
                _id
                name
                username
                pic
                role
            }
            createdBy {
                _id
                name
                username
                pic
                role
            }
            pendingBorrowRequests {
                _id
                name
                username
                pic
                role
            }
        }
    }
}

<=== RESPONSE ====>
{
    "data": {
        "users": [
            {
                "_id": "66002784b8f9358edb63cf46",
                "name": "Ali",
                "email": "ali@developersdrills.com",
                "username": "ali",
                "pic": "https://source.unsplash.com/100x100/?portrait",
                "role": "subscriber",
                "createdAt": "1711286148534",
                "updatedAt": "1711374066521",
                "books": []
            },
            {
                "_id": "66002d57f2dedc44f31be910",
                "name": "Ali",
                "email": "saif@netgains.org",
                "username": "saif",
                "pic": "https://source.unsplash.com/100x100/?portrait",
                "role": "admin",
                "createdAt": "1711287639315",
                "updatedAt": "1711366737124",
                "books": [
                    {
                        "_id": "6600f8d6e0d1523aea30d653",
                        "title": "Power",
                        "description": "Power of Saif",
                        "author": null,
                        "createdAt": "1711339734947",
                        "updatedAt": "1711376744019",
                        "currentOwner": {
                            "_id": "66002d57f2dedc44f31be910",
                            "name": "Ali",
                            "username": "saif",
                            "pic": "https://source.unsplash.com/100x100/?portrait",
                            "role": "admin"
                        },
                        "createdBy": {
                            "_id": "66002d57f2dedc44f31be910",
                            "name": "Ali",
                            "username": "saif",
                            "pic": "https://source.unsplash.com/100x100/?portrait",
                            "role": "admin"
                        },
                        "pendingBorrowRequests": []
                    },
                    {
                        "_id": "6600f92a77212a5e1400dc8e",
                        "title": "Development",
                        "description": null,
                        "author": null,
                        "createdAt": "1711339818996",
                        "updatedAt": "1711354082324",
                        "currentOwner": {
                            "_id": "66002d57f2dedc44f31be910",
                            "name": "Ali",
                            "username": "saif",
                            "pic": "https://source.unsplash.com/100x100/?portrait",
                            "role": "admin"
                        },
                        "createdBy": {
                            "_id": "66002d57f2dedc44f31be910",
                            "name": "Ali",
                            "username": "saif",
                            "pic": "https://source.unsplash.com/100x100/?portrait",
                            "role": "admin"
                        },
                        "pendingBorrowRequests": [
                            {
                                "_id": "66002784b8f9358edb63cf46",
                                "name": "Ali",
                                "username": "ali",
                                "pic": "https://source.unsplash.com/100x100/?portrait",
                                "role": "subscriber"
                            },
                            {
                                "_id": "66002784b8f9358edb63cf46",
                                "name": "Ali",
                                "username": "ali",
                                "pic": "https://source.unsplash.com/100x100/?portrait",
                                "role": "subscriber"
                            },
                            {
                                "_id": "66002784b8f9358edb63cf46",
                                "name": "Ali",
                                "username": "ali",
                                "pic": "https://source.unsplash.com/100x100/?portrait",
                                "role": "subscriber"
                            },
                            {
                                "_id": "66002784b8f9358edb63cf46",
                                "name": "Ali",
                                "username": "ali",
                                "pic": "https://source.unsplash.com/100x100/?portrait",
                                "role": "subscriber"
                            },
                            {
                                "_id": "66002784b8f9358edb63cf46",
                                "name": "Ali",
                                "username": "ali",
                                "pic": "https://source.unsplash.com/100x100/?portrait",
                                "role": "subscriber"
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```
