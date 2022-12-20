import express from "express";
import {forgotPassword, login, resetPassword, signup, verifyPasswordResetCode} from "../services/AuthService.js";
import {loginValidator, signupValidator} from "../utils/validations/AuthValidation.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyPasswordResetCode", verifyPasswordResetCode);
router.put("/resetPassword", resetPassword);

export default router;
