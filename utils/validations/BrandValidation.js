import { check } from "express-validator";
import slugify from "slugify";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";

export const ValidationbodyRulesForCreate = [
  check("name")
    .notEmpty()
    .withMessage("brand name is required !")
    .isString()
    .withMessage("brand name must be string !")
    .isLength({ min: 3 })
    .withMessage("brand name is too short !")
    .isLength({ max: 32 })
    .withMessage("brand name is too long !")
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
    })
    ,
  validatorMiddleware,
];
