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
import {permissions} from "../services/AuthService.js"

router.get("/", index);
router.get("/:id", validationparmsRules("id"), show);
router.post(
    "/", permissions('admin', 'maneger'),
    [uploadImage, resizeImage],
    ValidationbodyRulesForCreate,
    create
);
router.put(
    "/:id", permissions('admin', 'maneger'),
    [validationparmsRules("id"), uploadImage, resizeImage],
    ValidationbodyRulesForUpdate,
    update
);
router.delete("/:id", permissions('admin'), validationparmsRules("id"), destroy);

export default router;
