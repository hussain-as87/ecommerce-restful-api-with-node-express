import express from "express";
import {
    checkoutSession,
    create,
    filterOrderForLoggedUser,
    index,
    show,
    updateOrderDeliveredStatus,
    updateOrderPaidStatus,
} from "../services/OrderService.js";
import {permissions} from "../services/AuthService.js";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";

const router = express.Router();


router.get(
    "/checkout-session/:cartId",
    [validationparmsRules("cartId"), permissions("user")],
    checkoutSession
);
router.get(
    "/",
    [permissions("admin", "manager", "user"), filterOrderForLoggedUser],
    index
);
router.get("/:id", validationparmsRules("id"), show);
router.post("/:cartId", permissions("user"), create);
router.put(
    "/:id/pay",
    permissions("admin", "manager"),
    validationparmsRules("id"),
    updateOrderPaidStatus
);
router.put(
    "/:id/deliver",
    permissions("admin", "manager"),
    validationparmsRules("id"),
    updateOrderDeliveredStatus
);
 //router.delete("/:id", permissions('admin'),validationparmsRules("id"), destroy);
export default router;
