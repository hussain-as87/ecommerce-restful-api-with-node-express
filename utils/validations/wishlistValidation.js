import {check} from "express-validator";
import {validatorMiddleware} from "../../middlewares/ValidatorMiddleware.js";
import {Product} from "../../models/Product.js";

export const createwishlistValidation = [
    check("productId")
        .notEmpty()
        .withMessage("product id can't be null.")
        .isMongoId()
        .withMessage("product id not mongo id.")
        .custom(async (val) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new Error("the product id undefined.");
            }
            return true;
        }),
    validatorMiddleware,
];
