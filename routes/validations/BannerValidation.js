import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";

export const ValidationbodyRulesForCreate = [
  check("title")
    .notEmpty()
    .withMessage("Banner title is required!")
    .isString()
    .withMessage("Banner title must be string!")
    .isLength({ min: 3 })
    .withMessage("Banner title is too short!")
    .isLength({ max: 32 })
    .withMessage("Banner title is too long!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),check("subtitle")
    .notEmpty()
    .withMessage("Banner subtitle is required!")
    .isString()
    .withMessage("Banner subtitle must be string!")
    .isLength({ min: 3 })
    .withMessage("Banner subtitle is too short!")
    .isLength({ max: 32 })
    .withMessage("Banner subtitle is too long!"),
    check("summary")
    .notEmpty()
    .withMessage("Banner summary is required!")
    .isString()
    .withMessage("Banner summary must be string!"),
    check("description")
    .notEmpty()
    .withMessage("Banner description is required!")
    .isString()
    .withMessage("Banner description must be string!"),
  check("image").notEmpty().withMessage("Image is required!"),
  validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
    check("title")
        .optional()
        .isString()
        .withMessage("Banner title must be string!")
        .isLength({ min: 3 })
        .withMessage("Banner title is too short!")
        .isLength({ max: 32 })
        .withMessage("Banner title is too long!")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),check("subtitle")
        .optional()
        .isString()
        .withMessage("Banner subtitle must be string!")
        .isLength({ min: 3 })
        .withMessage("Banner subtitle is too short!")
        .isLength({ max: 32 })
        .withMessage("Banner subtitle is too long!"),
    check("summary")
        .optional()
        .isString()
        .withMessage("Banner summary must be string!"),
    check("description")
        .optional()
        .isString()
        .withMessage("Banner description must be string!"),
    check("image").optional(),

  validatorMiddleware,
];
