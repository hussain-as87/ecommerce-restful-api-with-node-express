import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {ValidationbodyRulesForCreate} from "../middlewares/validations/CartValidation.js";
import {permissions} from "../services/AuthService.js";
import {
    applyCoupon,
    clearCart,
    create,
    destroy,
    index,
    updateQuantity,
} from "../services/CartService.js";

const router = express.Router();

router.get("/", index);

router.post("/", permissions("user"), ValidationbodyRulesForCreate, create);
router.post("/applyCoupon", permissions("user"), applyCoupon);

router.put(
    "/:itemId",
    permissions("user"),
    validationparmsRules("itemId"),
    updateQuantity
);
router.delete(
    "/:itemId",
    permissions("user"),
    validationparmsRules("itemId"),
    destroy
);
router.delete("/", permissions("user"), clearCart);

export default router;
