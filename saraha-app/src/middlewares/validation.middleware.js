import { ServerError } from "../utils/serverError.js";

const data = ["body", "params", "query"];

export const validation = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    data.forEach((e) => {
      if (schema[e]) {
        const validationRes = schema[e].validate(req[e], { abortEarly: false });

        if (validationRes.error) {
          validationErrors.push({
            [e]: validationRes.error.details.map((err) => err.message),
          });
        }
      }
    });

    if (validationErrors.length) {
      return res.status(422).json({
        success: false,
        code: 422,
        errors: validationErrors,
      });
    } else {
      return next();
    }
  };
};
