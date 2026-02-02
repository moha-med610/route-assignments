import { Router } from "express";
import * as userService from "./users.service.js";
import { verifyToken } from "../../middlewares/verifyToken.middleware.js";
import { responseSuccess } from "../../utils/response.js";
import { getTokenFromHeader } from "../../utils/getTokenFromHeader.js";

const router = Router();

const routes = {
  signup: "/signup",
  login: "/login",
};

router.post(routes.signup, async (req, res, next) => {
  const { name, email, password, phone, age } = req.body;
  const service = await userService.signupService({
    name,
    email,
    password,
    phone,
    age,
  });

  return responseSuccess(res, 201, "User signed up successfully", service);
});

router.post(routes.login, async (req, res, next) => {
  const { email, password } = req.body;
  const service = await userService.loginService({ email, password });
  return responseSuccess(res, 201, "User logged in successfully", service);
});

router.patch("/", verifyToken, async (req, res, next) => {
  const { name, email, age } = req.body;
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);
  const service = await userService.updateUserService({
    name,
    email,
    age,
    token,
  });
  return responseSuccess(res, 202, "User Updated Successfully", service);
});

router.delete("/", verifyToken, async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);
  const service = await userService.deleteUserService({ token });
  return responseSuccess(res, 201, "User deleted successfully", service);
});

router.get("/", verifyToken, async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = getTokenFromHeader(authHeader);

  const service = await userService.getUserLoggedInService({ token });
  return responseSuccess(res, 200, "User fetched successfully", service);
});

export default router;
