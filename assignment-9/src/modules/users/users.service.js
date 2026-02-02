import { Users } from "../../db/models/users.model.js";
import { ServerError } from "../../utils/serverError.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "../../utils/encryptedService.js";

export const signupService = async ({ name, email, password, phone, age }) => {
  const checkIEmailExist = await Users.findOne({ email });
  if (checkIEmailExist) {
    throw new ServerError(false, 400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const encryptPhone = encrypt(phone);

  const newUser = await Users.create({
    name,
    email,
    password: hashedPassword,
    phone: encryptPhone,
    age,
  });

  return newUser;
};

export const loginService = async ({ email, password }) => {
  const findUser = await Users.findOne({ email });
  if (!findUser) {
    throw new ServerError(false, 404, "Invalid Credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, findUser.password);
  if (!isPasswordValid) {
    throw new ServerError(false, 401, "Invalid Credentials");
  }

  const token = generateToken({ id: findUser._id, email: findUser.email });
  return { findUser, token };
};

export const updateUserService = async ({ name, email, age, token }) => {
  const userId = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userId.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const updateUser = await Users.findByIdAndUpdate(
    userId.id,
    { name, email, age },
    { new: true },
  );

  return updateUser;
};

export const deleteUserService = async ({ token }) => {
  const userId = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userId.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const deletedUser = await Users.findByIdAndDelete(userId.id);
  return deletedUser;
};

export const getUserLoggedInService = async ({ token }) => {
  const userId = jwt.verify(token, process.env.JWT_SECRET);

  const findUser = await Users.findById(userId.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  //   const userObj = findUser.toObject();

  const decryptedPhone = decrypt(findUser.phone);
  return { ...findUser.toObject(), phone: decryptedPhone };
};
