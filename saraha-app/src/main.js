import express from "express";
import { connectDb } from "./db/db.connection.js";
import { errorHandlingMiddleware } from "./middlewares/serverErrorHandler.js";
import { notFoundMiddleware } from "./middlewares/notFoundHandler.js";
import authRouter from "./modules/auth/auth.controller.js";
import cors from "cors";
import usersRouter from "./modules/users/users.controller.js";

export const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cors());
  app.use("/uploads", express.static("./uploads"));

  // routes
  app.use("/auth", authRouter);
  app.use("/users", usersRouter);

  // error handler middleware
  app.use(notFoundMiddleware);
  app.use(errorHandlingMiddleware);

  // server listen
  app.listen(PORT, async () => {
    try {
      await connectDb();
      console.log(`Server is Running on http://localhost:${PORT}`);
    } catch (error) {
      console.log(`Failed To Running Server: ${error.message}`);
    }
  });
};
