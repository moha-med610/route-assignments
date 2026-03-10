import joi from "joi";
import { ROLES } from "../../constants/roles.js";
import { Logout } from "../../constants/flag.js";

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

export const logoutSchema = {
  body: joi.object({
    flag: joi
      .string()
      .valid(...Object.values(Logout))
      .required(),
  }),
};
