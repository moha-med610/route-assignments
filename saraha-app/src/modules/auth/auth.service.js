import { Users } from "../../db/models/users.model.js";
import { sendEmail } from "../../config/nodemailer.config.js";
import { otp } from "../../utils/otpGenerator.js";
import { ServerError } from "../../utils/serverError.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import { PROVIDER } from "../../constants/provider.js";
import { Logout } from "../../constants/flag.js";
import { accessTokenService, refreshTokenService } from "../../utils/tokens.js";
import { RevokeToken } from "../../db/models/token.model.js";

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

  const accessToken = accessTokenService({
    payload: { id: newUser._id, role: newUser.role, email: newUser.email },
  });

  const refreshToken = refreshTokenService({
    payload: { id: newUser._id, role: newUser.role, email: newUser.email },
  });

  sendEmail({
    email: newUser.email,
    otp,
    userName: newUser.firstName,
  }).catch((e) => console.log("Error to Send Email"));

  return { accessToken, refreshToken };
};

export const loginService = async ({ email, password }) => {
  const findUser = await Users.findOne({ email });

  if (!findUser) {
    throw new ServerError(false, 400, "Invalid Credentials");
  }
  if (findUser.provider === PROVIDER.google) {
    throw new ServerError(false, 400, "use google login");
  }

  const isCorrectPassword = await bcrypt.compare(password, findUser.password);
  if (!isCorrectPassword) {
    throw new ServerError(false, 400, "Invalid Credentials");
  }

  findUser.otpExpire = new Date(Date.now() + 5 * 60 * 1000);
  await findUser.save();

  const accessToken = accessTokenService({
    payload: { id: findUser._id, role: findUser.role, email: findUser.email },
  });

  const refreshToken = refreshTokenService({
    payload: { id: findUser._id, role: findUser.role, email: findUser.email },
  });

  sendEmail({
    email: findUser.email,
    userName: findUser.firstName,
    otp,
  });
  return { accessToken, refreshToken };
};

export const googleSignUp = async ({ googleToken }) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const { name, email, email_verified } = ticket.getPayload();

  const isEmailExist = await Users.findOne({ email });

  let accessToken;
  let refreshToken;

  if (isEmailExist) {
    if (isEmailExist.provider === PROVIDER.system) {
      throw new ServerError(false, 400, "use system login");
    }

    accessToken = accessTokenService({
      payload: {
        id: isEmailExist._id,
        role: isEmailExist.role,
        email: isEmailExist.email,
      },
    });

    refreshToken = refreshTokenService({
      payload: {
        id: isEmailExist._id,
        role: isEmailExist.role,
        email: isEmailExist.email,
      },
    });
  } else {
    const newUser = await Users.create({
      userName: name,
      email,
      provider: PROVIDER.google,
      isActivate: email_verified,
    });

    accessToken = accessTokenService({
      payload: { id: newUser._id, role: newUser.role, email: newUser.email },
    });

    refreshToken = refreshTokenService({
      payload: { id: newUser._id, role: newUser.role, email: newUser.email },
    });
  }

  return { accessToken, refreshToken };
};

export const logoutService = async ({ user, jti, iat, flag = Logout.all }) => {
  if (flag == Logout.all) {
    user.credential_change_at = new Date();
    await user.save();
  } else {
    await RevokeToken.create({
      userId: user.id,
      jti,
      expireIn: new Date((iat + 14 * 24 * 60 * 60) * 1000),
    });
  }
  return { msg: "Logged out Successfully" };
};
