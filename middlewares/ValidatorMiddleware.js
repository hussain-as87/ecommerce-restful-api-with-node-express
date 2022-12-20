import {check, validationResult} from "express-validator";

// Finds  the validation errors in this request and wraps them in an object with handy functions
export const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    next();
};
/*
*params id
*/
export const validationparmsRules = (param) => [
    check(param).isMongoId().notEmpty().withMessage("Invalid id in format !"),
    validatorMiddleware,
];