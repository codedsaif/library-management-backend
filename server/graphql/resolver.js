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
  // testing function
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
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return { ...user._doc, _id: user._id.toString() };
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
  // update book
  updateBook: function (req, res) {
    console.log("Book ID", req.body.id);
    return res.status(200).json({ status: "success" });
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

  // can see all users
  users: async function (_, req, res) {
    if (!restrictTo(["admin"], req?.user)) {
      throw new AppError("You don't have permission to see all users", 401);
    }
    const books = await User.find();
    return books;
  },
};
