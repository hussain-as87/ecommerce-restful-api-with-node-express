import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {
    create,
    destroy,
    index,
    resizeProductImages,
    show,
    update,
    uploadProductImages
} from "../services/ProductService.js";

import {ValidationbodyRulesForCreate, ValidationbodyRulesForUpdate} from "../utils/validations/ProductValidation.js"

import {permissions, protect} from "../services/AuthService.js";
import reviewsRoute from "./review.js"

const router = express.Router();


//nested route
router.use("/:productId/reviews", reviewsRoute);
router.get("/", index);
router.get("/:id", validationparmsRules("id"), show);
router.post("/",protect, permissions('admin', 'manager'),  [uploadProductImages, resizeProductImages ], ValidationbodyRulesForCreate, create);
router.put("/:id",protect, permissions('admin', 'manager'),[uploadProductImages, resizeProductImages], validationparmsRules("id"), ValidationbodyRulesForUpdate,update);
router.delete("/:id",protect, permissions('admin'), validationparmsRules("id"), destroy);

export default router;
