import {check} from "express-validator";
import {validatorMiddleware} from "../../middlewares/ValidatorMiddleware.js";

export const ValidationbodyRulesForCreate = [
    check("name")
        .notEmpty()
        .withMessage("coupon name is required !")
        .isString()
        .withMessage("coupon name must be string !"),
    check("discount")
        .notEmpty()
        .withMessage("coupon discount value is required !")
        .isInt()
        .withMessage("coupon discount value must be number !"),
    check("expire")
        .notEmpty()
        .withMessage("coupon expire time is required !")
        .isDate()
        .withMessage("coupon expire time must be date !"),
    validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
    check("name")
        .optional()
        .isString()
        .withMessage("coupon name must be string !"),
    check("discount")
        .optional()
        .isInt()
        .withMessage("coupon discount value must be number !"),
    check("expire")
        .optional()
        .isDate()
        .withMessage("coupon expire must be data !"),
    validatorMiddleware,
];
