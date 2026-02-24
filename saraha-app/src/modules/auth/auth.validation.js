import joi from "joi";
import { ROLES } from "../../constants/roles.js";

export const signupSchema = {
  body: joi.object({
    firstName: joi.string().min(2).max(30).required(),
    lastName: joi.string().min(2).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    role: joi.number().allow(...Object.values(ROLES)),
  }),
};

export const loginSchema = {
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  }),
};
