import Joi from "joi";
import { fileTypes } from "../../middlewares/multer.js";

export const profileImageSchema = {
  fieldname: Joi.string().required().valid("image"),
  originalname: Joi.string().required(),
  encoding: Joi.string().required(),
  mimetype: Joi.string()
    .valid(...Object.values(fileTypes.image))
    .required(),
  finalPath: Joi.string().required(),
  filename: Joi.string().required(),
  path: Joi.string().required(),
  destination: Joi.string().required(),
  size: Joi.number().required(),
};
