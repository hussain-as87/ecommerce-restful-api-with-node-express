import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";
import { User } from "../../models/User.js";
import bcrypt from "bcryptjs";

export const signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name is required !")
    .isString()
    .withMessage("user name must be string !")
    .isLength({ min: 2 })
    .withMessage("user name is too short !")
    .isLength({ max: 55 })
    .withMessage("user name is too long !")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];
export const resetPasswordValidator = [
  check("newPassword")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.newPasswordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
  check("newPasswordConfirm")
    .notEmpty()
    .withMessage("Password confirmation required"),

  validatorMiddleware,
];
export const forgotPasswordValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (!user) {
          return Promise.reject(new Error("E-mail doesn't exist!"));
        }
      })
    ),
  validatorMiddleware,
];
export const verifyPasswordResetCodeValidation = [
  check("resetCode")
    .notEmpty()
    .withMessage("Reset code required!")
    .isLength({ min: 6, max: 6 })
    .withMessage("Reset code must be 6 characters")
    .custom((val) =>
      User.findOne({ passwordResetCode: val }).then((user) => {
        if (!user) {
          return Promise.reject(new Error("Reset code incorrect try again!"));
        }
      })
    ),
  validatorMiddleware,
];
