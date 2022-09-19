import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import { login, signup } from "../services/AuthService.js";
import { loginValidator, signupValidator } from "../utils/validations/AuthValidation.js";
const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

export default router;
