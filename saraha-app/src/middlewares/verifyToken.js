import jwt from "jsonwebtoken";
import { ServerError } from "../utils/serverError";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(ServerError(false, 401, "Unauthorized, Please Login Again"));
  }

  try {
    const currentUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    req.currentUser = currentUser;

    next();
  } catch (e) {
    const errorMessage =
      e.name === "TokenExpiredError" ? "Token has expired" : "Invalid token";
    return next(ServerError(false, 401, errorMessage));
  }
};
