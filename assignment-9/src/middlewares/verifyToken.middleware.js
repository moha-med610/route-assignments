import jwt from "jsonwebtoken";
import { ServerError } from "../utils/serverError.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new ServerError(false, 401, "Unauthorized. Please login again."),
    );
  }

  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET);

    req.currentUser = currentUser;

    next();
  } catch (err) {
    const errorMessage =
      err.name === "TokenExpiredError" ? "Token has expired" : "Invalid token";
    return next(new ServerError(false, 401, errorMessage));
  }
};
