import User from "./../models/User.js";
import Book from "./../models/Book.js";
import AppError from "../utils/appError.js";
import { signToken } from "../controllers/authController.js";
import { restrictTo } from "../middleware/auth.js";

export const resolver = {
  // testing function
  hello() {
    return { message: "Hi Saif", count: "35000" };
  },

  // registering user
  signup: async function (args, req, res, next) {
    const { name, email, password, passwordConfirm } = args.userData;

    if (!name || !email || !password || !passwordConfirm) {
      //   return next(new AppError("Please provide all values", 400));
      throw new AppError("Please provide all values", 400);
    }
    const userAlreadyExists = await User.findOne({ email });
    // console.log("User Already Exists", userAlreadyExists);

    if (userAlreadyExists) {
      //   return next(new AppError("Email already in use", 409));
      throw new AppError("Email already in use", 409);
    }

    // crating new user with provided details
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    // creating token
    const token = signToken(newUser._id);

    return { user: { ...newUser._doc, _id: newUser._id.toString() }, token };
  },

  // signin user
  signin: async function ({ email, password }, req, res, next) {
    // 1) Checking if email and password exist
    if (!email || !password) {
      throw new AppError("Please provide email and password!", 400);
    }

    // 2) Checking if user exists && password is correct
    const user = await User.findOne({ email })
      .select("+password")
      .populate("books");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    // creating token
    const token = signToken(user._id);
    return {
      user: {
        ...user._doc,
        _id: user._id.toString(),
        books: user?.books,
      },
      token,
    };
  },

  // update user
  updateUser: async function (args, req, res, next) {
    let {
      id,
      updateUserData: { name, email, username, pic, role },
    } = args;
    // user itself don't have ability to update role
    if (req?.user?.role !== "admin") {
      role = undefined;
    }

    if (req?.user._id.toString() !== id && !restrictTo(["admin"], req?.user)) {
      throw new AppError(
        "You don't have permission to update other user expected user self",
        401
      );
    }
    const updateObject = {};
    if (name) updateObject.name = name;
    if (email) updateObject.email = email;
    if (username) updateObject.username = username;
    if (pic) updateObject.pic = pic;
    if (role) updateObject.role = role;

    const user = await User.findByIdAndUpdate(id, updateObject, {
      new: true,
      runValidators: true,
    }).populate("books");
    console.log("User", user);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return { ...user._doc, _id: user._id.toString(), books: user?.books };
  },

  // admin or user self can remove himself
  removeUser: async function (args, req, res, next) {
    // destructuring id from args
    const { id } = args;
    if (!id) {
      throw new AppError("Please provide book unique id", 400);
    }
    // restricted to self & admin only
    if (req?.user._id.toString() !== id && !restrictTo(["admin"], req?.user)) {
      throw new AppError("You don't have permission to see all users", 401);
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return { status: "success", message: "User removed successfully" };
  },

  // addling new book
  addBook: async function (args, req, res, next) {
    // allow only for admin
    if (!restrictTo(["admin"], req?.user)) {
      throw new AppError("You don't have permission to add new book", 401);
    }
    const { _id: createdBy } = req?.user;
    const { title, description, author } = args.bookData;
    if (!title) {
      throw new AppError("Please provide book title", 400);
    }
    const bookAlreadyExists = await Book.findOne({ title });

    if (bookAlreadyExists) {
      throw new AppError("Book already exist", 409);
    }

    // crating new book
    const newBook = await Book.create({
      title,
      description,
      author,
      createdBy,
    });

    return {
      ...newBook._doc,
      _id: newBook._id.toString(),
      createdBy: req?.user,
      createdAt: newBook.createdAt.toISOString(),
      updatedAt: newBook.updatedAt.toISOString(),
    };
  },

  // getAll books
  books: async function ({ title }, req, res, next) {
    let searchBasedUpon = {};
    if (title) {
      searchBasedUpon.title = { $regex: title, $options: "i" };
    }
    const books = await Book.find(searchBasedUpon).populate([
      "createdBy",
      "currentOwner",
      "pendingBorrowRequests",
    ]);
    return books;
  },

  // update book
  updateBook: async function (args, req, res, next) {
    // only restricted roles can update book
    if (!restrictTo(["admin"], req?.user)) {
      throw new AppError("You don't have permission to update book.", 401);
    }

    // destructuring id from args
    const { id, bookData } = args;
    if (!id) {
      throw new AppError("Please provide book id", 400);
    }

    const book = await Book.findByIdAndUpdate(id, bookData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    return { ...book._doc, _id: book._id.toString() };
  },

  // delete book this can restricted to only admin
  removeBook: async function (args, req, res, next) {
    // restricted to admin only
    if (!restrictTo(["admin"], req?.user)) {
      throw new AppError("You don't have permission to remove book.", 401);
    }
    // destructuring id from args
    const { id } = args;
    if (!id) {
      throw new AppError("Please provide book id", 400);
    }
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    return { status: "success", message: "book deleted successfully" };
  },

  // Request for book
  borrowBook: async function ({ id }, req, res, next) {
    // just doing for login purpose
    restrictTo([], req?.user);

    if (!id) {
      throw new AppError("Please provide book id", 400);
    }
    const book = await Book.findById(id).populate([
      "createdBy",
      "currentOwner",
      "pendingBorrowRequests",
    ]);
    // if book not found
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    // when no current owner, assign direct to user
    if (!book.currentOwner) {
      book.currentOwner = req.user?._id;
      await book.save();
      return {
        message: `Now it's your book ${req.user?.name}`,
        book: { ...book._doc, _id: book._id.toString() },
      };
    } else if (book.currentOwner?._id.toString() === req.user?._id.toString()) {
      throw new AppError("You are already owner of the book", 208);
    }

    // when already made request
    const userId = req.user?._id.toString();
    const userInPendingRequests = book.pendingBorrowRequests.find(
      (request) => request._id.toString() === userId
    );
    if (userInPendingRequests) {
      // if (book.pendingBorrowRequests.includes(req.user?._id.toString())) {
      throw new AppError("You already made a request. Please wait...", 207);
    }

    // add the user's ID to the pending borrow requests
    book.pendingBorrowRequests.push(req.user?._id);

    await book.save();

    return {
      message: `Request made Successfully ${req.user?.name}. Please wait...`,
      book: {
        ...book._doc,
        _id: book._id.toString(),
        createdBy: book?.createdBy,
        currentOwner: book?.currentOwner,
        pendingBorrowRequests: book?.pendingBorrowRequests.slice(
          0,
          book?.pendingBorrowRequests.length - 1
        ),
      },
    };
  },

  // transfer borrow
  transferBook: async function ({ id }, req, res, next) {
    // just doing for login purpose
    restrictTo([], req?.user);

    if (!id) {
      throw new AppError("Please provide book id", 400);
    }
    const book = await Book.findById(id).populate([
      "createdBy",
      "currentOwner",
      "pendingBorrowRequests",
    ]);
    // if book not found
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    // when no current owner, assign direct to user
    if (
      book.currentOwner?._id.toString() !== req.user?._id.toString() &&
      !restrictTo(["admin"], req?.user)
    ) {
      throw new AppError("You are not owner of the book", 422);
    }

    // if no user available in pending queue
    if (book.pendingBorrowRequests?.length > 0) {
      book.currentOwner = book.pendingBorrowRequests[0]?._id;
      book.pendingBorrowRequests.shift();
      // is user not available in queue
    } else {
      book.currentOwner = null;
    }

    await book.save();

    // return {
    //   message: `Ownership transferred successfully`,
    //   book: { ...book._doc, _id: book._id.toString() },
    // };
    return {
      message: `Request made Successfully ${req.user?.name}. Please wait...`,
      book: {
        ...book._doc,
        _id: book._id.toString(),
        createdBy: book?.createdBy,
        currentOwner: book?.currentOwner,
        pendingBorrowRequests: book?.pendingBorrowRequests.slice(
          0,
          book?.pendingBorrowRequests.length - 1
        ),
      },
    };
  },

  // can see all users
  users: async function (_, req, res) {
    if (!restrictTo(["admin"], req?.user)) {
      throw new AppError("You don't have permission to see all users", 401);
    }
    const books = await User.find().populate("books");
    return books;
  },
};
