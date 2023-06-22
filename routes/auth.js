import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  verifyPasswordResetCode,
} from "../services/AuthService.js";
import {
  loginValidator,
  signupValidator,
  resetPasswordValidator,
  forgotPasswordValidation,
  verifyPasswordResetCodeValidation,
} from "../utils/validations/AuthValidation.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPasswordValidation, forgotPassword);
router.post(
  "/verifyPasswordResetCode",
  verifyPasswordResetCodeValidation,
  verifyPasswordResetCode
);
router.put("/resetPassword", resetPasswordValidator, resetPassword);

export default router;
