import express from "express";
import { connectDb } from "./db/db.connection.js";
import { errorHandlingMiddleware } from "./middlewares/serverErrorHandler.js";
import { notFoundMiddleware } from "./middlewares/notFoundHandler.js";
import authRouter from "./modules/auth/auth.controller.js";

export const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // routes
  app.use("/auth", authRouter);
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
