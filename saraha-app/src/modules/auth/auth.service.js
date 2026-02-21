import { Users } from "../../db/models/users.model.js";
import { sendEmail } from "../../config/nodemailer.config.js";
import { otp } from "../../utils/otpGenerator.js";
import { ServerError } from "../../utils/serverError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signupService = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  const isEmailExist = await Users.findOne({ email });
  if (isEmailExist) {
    throw new ServerError(false, 400, "Email Already Exist");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    otpExpire: new Date(Date.now() + 5 * 60 * 1000),
  });

  const token = jwt.sign(
    { id: newUser._id },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    },
  );
  const refreshToken = jwt.sign(
    { id: newUser._id },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    },
  );

  sendEmail({
    email: newUser.email,
    otp,
    userName: newUser.firstName,
  }).catch((e) => console.log("Error to Send Email"));

  await newUser.save();
  return { token, refreshToken };
};

export const loginService = async ({ email, password }) => {
  const findUser = await Users.findOne({ email });

  if (!findUser) {
    throw new ServerError(false, 400, "Invalid Credentials");
  }

  const isCorrectPassword = await bcrypt.compare(password, findUser.password);
  if (!isCorrectPassword) {
    throw new ServerError(false, 400, "Invalid Credentials");
  }

  findUser.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
  await findUser.save();

  const token = jwt.sign(
    { id: findUser._id },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    },
  );
  const refreshToken = jwt.sign(
    { id: findUser._id },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    },
  );

  sendEmail({
    email: findUser.email,
    userName: findUser.firstName,
    otp,
  });
  return { token, refreshToken };
};
