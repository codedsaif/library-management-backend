import User from "./../models/User.js";
import Book from "./../models/Book.js";
import AppError from "../utils/appError.js";
import { signToken } from "../controllers/authController.js";
import { restrictTo } from "../middleware/auth.js";

export const resolver = {
  // testing function
  hello() {
    return { message: "Hi Mukesh", count: "500" };
  },

  withHello() {
    return { message: "Hello With Hello" };
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
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new AppError("Incorrect email or password", 401);
    }

    // creating token
    const token = signToken(user._id);

    return { user: { ...user._doc, _id: user._id.toString() }, token };
  },

  // addling new book
  addBook: async function (args, req, res, next) {
    // allow only for admin
    restrictTo(["admin"], req?.user);
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
      createdAt: newBook.createdAt.toISOString(),
      updatedAt: newBook.updatedAt.toISOString(),
    };
  },
  // getAll books
  books: async function (req, res) {
    const books = await Book.find();
    return books;
  },
  book: function (req, res) {
    return res.status(200).json({ status: "success", book: {} });
  },
  updateBook: function (req, res) {
    console.log("Book ID", req.body.id);
    return res.status(200).json({ status: "success" });
  },
  deleteBook: function (req, res) {
    console.log("Book ID", req.body.id);
    return res.status(204).json({ status: "success" });
  },
  users: function (req, res) {
    console.log("Users");
    return res.status(200).json({ status: "success", users: [] });
  },
};
