import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { graphqlHTTP } from "express-graphql";

// allow to use all env file variables
// custom functions import
import { connectDB } from "./db/connect.js";
import AppError from "./utils/appError.js";
import { schema } from "./graphql/schema.js";
import { resolver } from "./graphql/resolver.js";

const port = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// using morgan in development only for showing routes in terminal
if (process.env.NODE_ENV === "DEV") {
  console.log("App is using morgan");
  app.use(morgan("dev"));
}

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
      const code = err.originalError.code || 500;
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
