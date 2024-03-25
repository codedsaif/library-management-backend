import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { promisify } from "util";
import User from "./../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next();
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    // console.log(currentUser);
    if (!currentUser) {
      return next();
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    // console.log("REQ BEFORE ADDING USER", req);
    req.user = currentUser;
    next();
  } catch (error) {
    return next();
  }
};

export const restrictTo = (roles, user) => {
  if (!user?.role) {
    throw new AppError("Please login first", 401);
  }
  if (!roles.includes(user?.role)) {
    // console.log("condition matched", user?.role);
    return false;
  }
  console.log("condition matched but not follow");
  return true;
};
