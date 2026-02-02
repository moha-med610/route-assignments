import express from "express";
import cli from "cli-colors";
import { dbConnection } from "./db/db.connection.js";
import { notFoundMiddleware } from "./middlewares/notfound.middleware.js";
import { errorHandlingMiddleware } from "./middlewares/errorHandling.middleware.js";
import notesRouter from "./modules/notes/notes.controller.js";
import usersRouter from "./modules/users/users.controller.js";

export const main = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // routes
  app.use("/users", usersRouter);
  app.use("/notes", notesRouter);

  // not found middleware
  app.use(notFoundMiddleware);

  // error handling middleware
  app.use(errorHandlingMiddleware);

  // server listening
  app.listen(PORT, async () => {
    console.log(cli.bgGreen(`Server is Running on http://localhost:${PORT}`));
  });

  await dbConnection();
};
