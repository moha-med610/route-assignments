import { Router } from "express";
import * as service from "./auth.service.js";
import { response } from "../../utils/response.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkRole } from "../../middlewares/checkRole.js";
import { ROLES } from "../../constants/roles.js";
import { loginSchema, logoutSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post("/signup", validation(signupSchema), async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const data = await service.signupService({
    firstName,
    lastName,
    email,
    password,
  });
  return response({
    res,
    statusCode: 201,
    success: true,
    message: "user Created Successfully",
    data,
  });
});

router.post("/login", validation(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const data = await service.loginService({ email, password });

  return response({
    res,
    statusCode: 202,
    success: true,
    message: "Welcome Back Again",
    data,
  });
});

router.get(
  "/profile",
  verifyToken,
  checkRole(ROLES.ADMIN, ROLES.USER),
  async (req, res) => {
    return response({
      res,
      data: req.user,
      message: "get Profile Successfully",
    });
  },
);

router.post("/signup/gmail", async (req, res) => {
  const { idToken } = req.body;

  const data = await service.googleSignUp({ googleToken: idToken });
  return response({
    res,
    data,
    message: "Successfully Signup with Google",
  });
});

router.patch(
  "/logout",
  verifyToken,
  validation(logoutSchema),
  async (req, res) => {
    const { flag } = req.body;

    await service.logoutService({
      user: req.user,
      jti: req.decoded.jti,
      iat: req.decoded.iat,
      flag,
    });

    return response({
      res,
      message: "Logged out successfully",
      data: {},
    });
  },
);

export default router;
