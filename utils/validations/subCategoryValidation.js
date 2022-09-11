import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";

export const ValidationbodyRulesForCreate = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required !")
    .isString()
    .withMessage("SubCategory name must be string !")
    .isLength({ min: 3 })
    .withMessage("SubCategory name is too short !")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too long !")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category parent is required !")
    .isMongoId()
    .withMessage("category id is Uncorrect !"),
  validatorMiddleware
];
export const ValidationbodyRulesForUpdate = [
  check("name")
    .optional()
    .isString()
    .withMessage("SubCategory name must be string !")
    .isLength({ min: 3 })
    .withMessage("SubCategory name is too short !")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too long !")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware
];
