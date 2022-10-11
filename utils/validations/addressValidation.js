import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/ValidatorMiddleware.js";

export const createaddressValidation = [
  check("alias").optional().isString(),
  check("details").optional().isString().isLength({ max: 500 }).withMessage('too long address.'),
  check('phone').optional().isMobilePhone(['ar-PS']).withMessage('the phone not belongs to palestine country.'),
  check('postalCode').optional().isString(),
  check('city').optional(),
  validatorMiddleware,
];
