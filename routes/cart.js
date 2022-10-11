import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  ValidationbodyRulesForCreate,
  ValidationbodyRulesForUpdate,
} from "../utils/validations/CartValidation.js";
import {permissions} from "../services/AuthService.js"
import { create } from "../services/CartService.js";
const router = express.Router();


/* router.get("/", index);
router.get("/:id", validationparmsRules("id"), show); */
router.post(
  "/",permissions('user'),
  ValidationbodyRulesForCreate,
   create
);
/* router.put(
  "/:id",permissions('admin','maneger'),
  validationparmsRules("id"),
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id", permissions('admin'),validationparmsRules("id"), destroy);
 */
export default router;
