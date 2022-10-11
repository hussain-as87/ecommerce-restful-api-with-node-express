import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";
import { Product } from "../../models/Product.js";

export const ValidationbodyRulesForCreate = [
  check("productId")
    .notEmpty()
    .withMessage("product id is required !")
    .isMongoId()
    .withMessage("product id must be mongo id !")
    .custom(async (val) => {
      const prodcut = await Product.findById(val);
      if (!prodcut) {
        throw new Error("product id is undefined");
      }
      return true;
    }),
  check("color")
    .notEmpty()
    .withMessage("product color value is required !")
    .isString()
    .withMessage("product color value must be string !"),
  validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
  check("productId")
    .optional()
    .isMongoId()
    .withMessage("product id must be mongo id !")
    .custom(async (val) => {
      const prodcut = await Product.findById(val);
      if (!prodcut) {
        throw new Error("product id is undefined");
      }
      return true;
    }),
  check("color")
    .optional()
    .isString()
    .withMessage("product color value must be string !"),
  validatorMiddleware,
];
