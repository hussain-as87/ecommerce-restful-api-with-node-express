import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {
    create,
    createFilterObj,
    destroy,
    index,
    setCategoryId,
    show,
    update
} from "../services/SubCategoryService.js";

import {ValidationbodyRulesForCreate, ValidationbodyRulesForUpdate} from "../middlewares/validations/SubCategoryValidation.js"

import {permissions, protect} from "../services/AuthService.js"
// to allow us to access parameters on other routes
const router = express.Router({mergeParams: true});

router.get("/", createFilterObj, index);
router.get("/:id",protect, validationparmsRules("id"), show);
router.post("/",protect, permissions('admin', 'manager'), [setCategoryId, ValidationbodyRulesForCreate], create);
router.put(
    "/:id",protect, permissions('admin', 'manager'),
    validationparmsRules("id"),

    ValidationbodyRulesForUpdate,

    update
);
router.delete("/:id",protect, permissions('admin'), validationparmsRules("id"), destroy);
/* apple */

export default router;
