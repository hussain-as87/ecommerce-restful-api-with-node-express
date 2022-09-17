import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  create,
  destroy,
  index,
  resizeProductImages,
  show,
  update,
  uploadProductImages
} from "../services/ProductService.js";
import {ValidationbodyRulesForCreate,ValidationbodyRulesForUpdate}from "../utils/validations/productValidation.js"

const router = express.Router();


//nested route
router.get("/", index);
router.get("/:id", validationparmsRules, show);
router.post("/", [uploadProductImages,resizeProductImages],ValidationbodyRulesForCreate, create);
router.put(
  "/:id",
  [uploadProductImages,resizeProductImages],
  validationparmsRules,
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id", validationparmsRules, destroy);

export default router;
