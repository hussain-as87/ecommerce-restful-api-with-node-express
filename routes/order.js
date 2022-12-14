import express from "express";
import {
  checkoutSession,
  create,
  filterOrderForLoggedUser,
  index,
  show,
  updateOrderDeliveredStatus,
  updateOrderPaidStatus,
  webhookCheckout
} from "../services/OrderService.js";
import { permissions } from "../services/AuthService.js";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";

const router = express.Router();


//checkout webhook
router.post('/webhook-checkout',express.raw({type:"application/json"}),webhookCheckout);
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
  permissions("admin", "maneger"),
  validationparmsRules("id"),
  updateOrderPaidStatus
);
router.put(
  "/:id/deliver",
  permissions("admin", "maneger"),
  validationparmsRules("id"),
  updateOrderDeliveredStatus
);
/* router.delete("/:id", permissions('admin'),validationparmsRules("id"), destroy);
 */
export default router;
