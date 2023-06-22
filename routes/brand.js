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
} from "../services/BrandService.js";
import {
    ValidationbodyRulesForCreate,
    ValidationbodyRulesForUpdate,
} from "../utils/validations/BrandValidation.js";

const router = express.Router();
import {permissions, protect} from "../services/AuthService.js"

router.get("/", index);
router.get("/:id",protect, validationparmsRules("id"), show);
router.post(
    "/",protect, permissions('admin', 'manager'),
    [uploadImage, resizeImage],
    ValidationbodyRulesForCreate,
    create
);
router.put(
    "/:id",protect, permissions('admin', 'manager'),
    [validationparmsRules("id"), uploadImage, resizeImage],
    ValidationbodyRulesForUpdate,
    update
);
router.delete("/:id",protect, permissions('admin'), validationparmsRules("id"), destroy);

export default router;
