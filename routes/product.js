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
/*
import {ValidationbodyRulesForCreate, ValidationbodyRulesForUpdate} from "../utils/validations/ProductValidation.js"
*/
import {permissions} from "../services/AuthService.js";
import reviewsRoute from "./review.js"

const router = express.Router();


//nested route
router.use("/:productId/reviews", reviewsRoute);
router.get("/", index);
router.get("/:id", validationparmsRules("id"), show);
router.post("/", permissions('admin', 'maneger'), [uploadProductImages, resizeProductImages]/*, ValidationbodyRulesForCreate*/, create);
router.put(
    "/:id", permissions('admin', 'maneger'),
    [uploadProductImages, resizeProductImages],
    validationparmsRules("id"),
/*
    ValidationbodyRulesForUpdate,
*/
    update
);
router.delete("/:id", permissions('admin'), validationparmsRules("id"), destroy);

export default router;
