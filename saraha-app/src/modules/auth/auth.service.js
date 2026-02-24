import { Users } from "../../db/models/users.model.js";
import { sendEmail } from "../../config/nodemailer.config.js";
import { otp } from "../../utils/otpGenerator.js";
import { ServerError } from "../../utils/serverError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { PROVIDER } from "../../constants/provider.js";

const client = new OAuth2Client();

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

  let hashedPassword;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12);
  }
  const newUser = Users({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    otpExpire: new Date(Date.now() + 5 * 60 * 1000),
  });

  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id, role: newUser.role },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    },
  );
  const refreshToken = jwt.sign(
    { id: newUser._id, role: newUser.role },
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

  return { token, refreshToken };
};

export const loginService = async ({ email, password }) => {
  const findUser = await Users.findOne({ email });

  if (!findUser) {
    throw new ServerError(false, 400, "Invalid Credentials");
  }
  if (findUser.provider === Provider.google) {
    throw new ServerError(false, 400, "use google login");
  }

  const isCorrectPassword = await bcrypt.compare(password, findUser.password);
  if (!isCorrectPassword) {
    throw new ServerError(false, 400, "Invalid Credentials");
  }

  findUser.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
  await findUser.save();

  const token = jwt.sign(
    { id: findUser._id, role: findUser.role },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    },
  );
  const refreshToken = jwt.sign(
    { id: findUser._id, role: findUser.role },
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

export const googleSignUp = async ({ googleToken }) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience:
      "515013149412-1phms59iupdf2gao7806cckqetfcvp80.apps.googleusercontent.com",
  });

  const { name, email, email_verified } = ticket.getPayload();

  const isEmailExist = await Users.findOne({ email });
  let accessToken;
  let refreshToken;

  if (isEmailExist) {
    if (isEmailExist.provider === PROVIDER.system) {
      throw new ServerError(false, 400, "use system login");
    }
    accessToken = jwt.sign(
      { id: isEmailExist._id, role: isEmailExist.role },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
      },
    );
    refreshToken = jwt.sign(
      { id: isEmailExist._id, role: isEmailExist.role },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
      },
    );
  } else {
    const newUser = Users.create({
      userName: name,
      email,
      provider: PROVIDER.google,
      isActivate: email_verified,
    });

    accessToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
      },
    );
    refreshToken = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
      },
    );
  }

  return { accessToken, refreshToken };
};
