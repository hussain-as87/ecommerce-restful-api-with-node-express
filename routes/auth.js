import express from "express";
import { forgotPassword, login, signup } from "../services/AuthService.js";
import { loginValidator, signupValidator } from "../utils/validations/AuthValidation.js";
const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);

export default router;
