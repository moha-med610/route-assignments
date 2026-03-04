import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { upload } from "../../middlewares/multer.js";
import * as service from "../users/users.service.js";
import { response } from "../../utils/response.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as validators from "./user.validation.js";
import { ServerError } from "../../utils/serverError.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { ROLES } from "../../constants/roles.js";

const router = Router();

router.patch(
  "/profile-image",
  verifyToken,
  upload({ dest: "profile-images" }).single("image"),
  validation(validators.profileImageSchema),
  async (req, res) => {
    const data = await service.uploadProfileImage({
      path: req.file.finalPath,
      user: req.user,
    });

    return response({
      res,
      status: 200,
      message: "Profile image uploaded successfully",
      data,
    });
  },
);

router.delete("/profile-image", verifyToken, async (req, res) => {
  await service.removeProfileImage({ user: req.user });
  return response({
    res,
    status: 200,
    message: "Profile image removed successfully",
  });
});

router.patch(
  "/:id/profile-visit",
  verifyToken,
  checkRole(ROLES.ADMIN),
  async (req, res) => {
    let data;
    if (req.user.id !== req.params.id) {
      data = await service.profileVisitCount({ userId: req.params.id });
    } else {
      throw new ServerError(
        false,
        400,
        "You cannot update your own profile visit count",
      );
    }

    return response({
      res,
      status: 200,
      message: "Profile visit count updated successfully",
      data,
    });
  },
);

export default router;
