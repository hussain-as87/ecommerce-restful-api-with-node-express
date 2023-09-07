import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {
    create,
    destroy,
    index,
    resizeImage,
    show,
    update,
    uploadImage,
} from "../services/CategoryService.js";
import {
    ValidationbodyRulesForCreate,
    ValidationbodyRulesForUpdate,
} from "./validations/CategoryValidation.js";
import {permissions, protect} from "../services/AuthService.js"
import subcategoriesRoute from "./subCategory.js";

const router = express.Router();

//nested route
router.use("/:categoryId/subcategories", subcategoriesRoute);
router.get("/", index);
router.get("/:id",protect, validationparmsRules("id"), show);
router.post("/", protect,permissions('admin', 'manager'), [uploadImage, resizeImage],ValidationbodyRulesForCreate, create);
router.put("/:id",protect, permissions('admin', 'manager'), [validationparmsRules("id"), uploadImage, resizeImage], ValidationbodyRulesForUpdate, update);
router.delete("/:id",protect, permissions('admin'), validationparmsRules("id"), destroy);

export default router;
