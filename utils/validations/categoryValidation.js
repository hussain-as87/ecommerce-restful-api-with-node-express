import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";
import slugify from "slugify";

export const ValidationbodyRulesForCreate = [
  check("name")
    .notEmpty()
    .withMessage("category name is required !")
    .isString()
    .withMessage("Category name must be string !")
    .isLength({ min: 3 })
    .withMessage("Category name is too short !")
    .isLength({ max: 32 })
    .withMessage("Category name is too long !")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
  check("name")
    .optional()
    .isString()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
