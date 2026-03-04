import { Users } from "../../db/models/users.model.js";
import fs from "fs/promises";
import { ServerError } from "../../utils/serverError.js";
import { Gallery } from "../../db/models/gallery.model.js";

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
