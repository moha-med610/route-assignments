import { Users } from "../../db/models/users.model.js";
import fs from "fs/promises";
import { ServerError } from "../../utils/serverError.js";
import { Gallery } from "../../db/models/gallery.model.js";
import bcrypt from "bcrypt";

export const uploadProfileImage = async ({ path, user }) => {
  if (user?.profileImage) {
    await Gallery.create({
      image: user.profileImage,
      user: user.id,
    });
  }

  const profileImage = await Users.updateOne(
    { _id: user.id },
    { profileImage: path },
  );
  return profileImage;
};

export const removeProfileImage = async ({ user }) => {
  if (user.profileImage) {
    try {
      await fs.unlink(user.profileImage);
    } catch (error) {
      throw new ServerError(
        false,
        500,
        `Failed to remove existing profile image: ${error?.message}`,
      );
    }
  }
  await Users.updateOne({ _id: user._id }, { profileImage: null });
};

export const profileVisitCount = async ({ userId }) => {
  const user = await Users.findByIdAndUpdate(
    userId,
    { $inc: { profileVisitCount: 1 } },
    { new: true },
  );
  return { profileVisitCount: user.profileVisitCount };
};

export const updateUserPassword = async ({
  user,
  password,
  newPassword,
  repeatNewPassword,
}) => {
  const findUser = await Users.findById(user.id);
  if (!findUser) {
    throw new ServerError(false, 404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, findUser.password);
  if (!isPasswordValid) {
    throw new ServerError(false, 400, "Invalid Password");
  }

  if (newPassword !== repeatNewPassword) {
    throw new ServerError(false, 400, "Passwords do not match");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  findUser.password = hashedPassword;
  await findUser.save();

  return { message: "Password updated successfully" };
};
