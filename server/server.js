import dotenv from "dotenv";
// allow to use all env file variables
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";

// custom functions import
import { connectDB } from "./db/connect.js";
import AppError from "./utils/appError.js";
import { schema } from "./graphql/schema.js";
import { resolver } from "./graphql/resolver.js";
import { protect } from "./middleware/auth.js";

const port = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// using morgan in development only for showing routes in terminal
if (process.env.NODE_ENV === "DEV") {
  console.log("App is using morgan");
  app.use(morgan("dev"));
}

// auth middleware
app.use(protect);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: resolver,
    // it's give query edit on post http://localhost:${post}/graphql
    graphiql: true,
    customFormatErrorFn: (err) => {
      if (!err.originalError) return err;
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.statusCode || 500;
      // console.log(
      //   "ERROR IN SERVER_GRAPHQL_CUSTOM",
      //   err.message,
      //   err.originalError.statusCode
      // );

      return { status: code, message, data };
    },
  })
);

// it's handle all routes which not available in app
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const server = async () => {
  try {
    // before server start connection to database
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("SERVER STARTING ERROR", error);
  }
};

// calling server function
server();
