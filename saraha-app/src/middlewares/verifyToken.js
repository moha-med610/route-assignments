import jwt from "jsonwebtoken";
import { ServerError } from "../utils/serverError.js";
import { Users } from "../db/models/users.model.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(
      new ServerError(false, 401, "Unauthorized, Please Login Again"),
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    const user = await Users.findById(decoded.id);

    if (!user) {
      return next(new ServerError(false, 404, "User Not Found"));
    }

    req.user = user;

    next();
  } catch (e) {
    const errorMessage =
      e.name === "TokenExpiredError" ? "Token has expired" : "Invalid token";
    return next(new ServerError(false, 401, errorMessage));
  }
};
