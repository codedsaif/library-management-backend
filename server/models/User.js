import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
      maxlength: [20, "A name must have less or equal than 20 characters"],
      minlength: [3, "A name must have more or equal than 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: [true, "Please provide a unique username"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      default: function () {
        return this.email.split("@")[0];
      },
    },
    pic: {
      type: String,
      default: "https://source.unsplash.com/100x100/?portrait",
    },
    role: {
      type: String,
      enum: ["registered", "subscriber", "admin"],
      default: "registered",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      maxlength: [20, "A password must have less or equal than 20 characters"],
      minlength: [6, "A password must have more or equal than 6 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ username: 1 });

userSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "currentOwner",
  justOne: false,
});

userSchema.virtual("pendingBorrowRequests", {
  ref: "Book",
  localField: "pendingBorrowRequests",
  foreignField: "_id",
  justOne: false,
});

userSchema.virtual("currentOwner", {
  ref: "Book",
  localField: "_id",
  foreignField: "currentOwner",
  justOne: true,
});

userSchema.virtual("createdBy", {
  ref: "Book",
  localField: "_id",
  foreignField: "createdBy",
  justOne: true,
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
