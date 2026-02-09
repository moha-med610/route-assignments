import { Router } from "express";
import * as service from "./auth.service.js";
import { response } from "../../utils/response.js";

const router = Router();

router.post("/signup", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

export default router;
