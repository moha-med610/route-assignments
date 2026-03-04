import { ServerError } from "../utils/serverError.js";

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ServerError(
        false,
        403,
        "Forbidden, You do not have permission to access this resource.",
      );
    }
    next();
  };
};
