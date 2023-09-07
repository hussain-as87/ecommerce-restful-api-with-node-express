import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {
    ValidationbodyRulesForCreate,
    ValidationbodyRulesForUpdate,
} from "./validations/CouponValidation.js";
import {permissions} from "../services/AuthService.js"
import {create, destroy, index, show, update} from "../services/CouponService.js";

const router = express.Router();


router.get("/", index);
router.get("/:id", validationparmsRules("id"), show);
router.post(
    "/", permissions('admin', 'manager'),
    ValidationbodyRulesForCreate,
    create
);
router.put(
    "/:id", permissions('admin', 'manager'),
    validationparmsRules("id"),
    ValidationbodyRulesForUpdate,
    update
);
router.delete("/:id", permissions('admin'), validationparmsRules("id"), destroy);

export default router;
