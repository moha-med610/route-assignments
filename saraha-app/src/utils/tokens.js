import jwt from "jsonwebtoken";

const jwtId = crypto.randomUUID();

export const accessTokenService = ({ payload }) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    jwtid: jwtId,
  });
};

export const refreshTokenService = ({ payload }) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    jwtid: jwtId,
  });
};
