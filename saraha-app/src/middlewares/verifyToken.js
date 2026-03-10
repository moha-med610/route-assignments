import jwt from "jsonwebtoken";
import { ServerError } from "../utils/serverError.js";
import { Users } from "../db/models/users.model.js";
import { RevokeToken } from "../db/models/token.model.js";

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

    const checkToken = await RevokeToken.findOne({ jti: decoded.jti });
    if (checkToken) {
      return next(
        new ServerError(
          false,
          401,
          "invalid token, Please Login Again, Your Token has been revoked",
        ),
      );
    }

    if (
      user.credential_change_at &&
      user.credential_change_at.getTime() >= decoded.iat * 1000
    ) {
      return next(
        new ServerError(
          false,
          401,
          "invalid token, Please Login Again, Your Credential has been blocked",
        ),
      );
    }

    req.user = user;
    req.decoded = decoded;

    next();
  } catch (e) {
    const errorMessage =
      e.name === "TokenExpiredError" ? "Token has expired" : "Invalid token";
    return next(new ServerError(false, 401, errorMessage));
  }
};
