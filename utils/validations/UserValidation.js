import {check} from "express-validator";
import slugify from "slugify";
import {validatorMiddleware} from "../../middlewares/ValidatorMiddleware.js";
import {User} from "../../models/User.js";
import bcrypt from "bcryptjs";

export const ValidationbodyRulesForCreate = [
    check("name")
        .notEmpty()
        .withMessage("user name is required !")
        .isString()
        .withMessage("user name must be string !")
        .isLength({min: 2})
        .withMessage("user name is too short !")
        .isLength({max: 55})
        .withMessage("user name is too long !")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .notEmpty()
        .withMessage("Email required")
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            User.findOne({email: val}).then((user) => {
                if (user) {
                    return Promise.reject(new Error("E-mail already in user"));
                }
            })
        ),
    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters")
        .custom((password, {req}) => {
            if (password !== req.body.passwordConfirm) {
                throw new Error("Password Confirmation incorrect");
            }
            return true;
        }),

    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation required"),
    check("phone")
        .optional()
        .isMobilePhone(["ar-PS", "ar-EG", "ar-SA"])
        .withMessage(
            "Invalid phone number only accepted PS and Egy and SA Phone numbers"
        ),

    check("profileImg").optional(),
    check("role").optional(),
    validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
    check("name")
        .optional()
        .isString()
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email address")
        .custom((val) =>
            User.findOne({email: val}).then((user) => {
                if (user) {
                    return Promise.reject(new Error("E-mail already in user"));
                }
            })
        ),
    check("phone")
        .optional()
        .isMobilePhone(["ar-PS", "ar-EG", "ar-SA"])
        .withMessage(
            "Invalid phone number only accepted PS and Egy and SA Phone numbers"
        ),

    check("profileImg").optional(),
    check("role").optional(),
    validatorMiddleware,
];

export const changePasswordValidator = [
    check("currentPassword")
        .notEmpty()
        .withMessage("You must enter your current password"),
    check("passwordConfirm")
        .notEmpty()
        .withMessage("You must enter the password confirm"),
    check("password")
        .notEmpty()
        .withMessage("You must enter new password")
        .custom(async (val, {req}) => {
            // 1) Verify current password
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error("There is no user for this id");
            }
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!isCorrectPassword) {
                throw new Error("Incorrect current password");
            }

            // 2) Verify password confirm
            if (val !== req.body.passwordConfirm) {
                throw new Error("Password Confirmation incorrect");
            }
            return true;
        }),
    validatorMiddleware,
];
