import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  ValidationbodyRulesForCreate,
  ValidationbodyRulesForUpdate,
} from "../utils/validations/CouponValidation.js";
import {permissions} from "../services/AuthService.js"
import { create, destroy, index, show, update } from "../services/CouponService.js";
const router = express.Router();


router.get("/", index);
router.get("/:id", validationparmsRules("id"), show);
router.post(
  "/",permissions('admin','maneger'),
  ValidationbodyRulesForCreate,
  create
);
router.put(
  "/:id",permissions('admin','maneger'),
  validationparmsRules("id"),
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id", permissions('admin'),validationparmsRules("id"), destroy);

export default router;