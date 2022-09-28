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
import {permissions} from "../services/AuthService.js"
const router = express.Router();


//nested route
router.get("/", index);
router.get("/:id", validationparmsRules, show);
router.post("/", permissions('admin','maneger'),[uploadProductImages,resizeProductImages],ValidationbodyRulesForCreate, create);
router.put(
  "/:id",permissions('admin','maneger'),
  [uploadProductImages,resizeProductImages],
  validationparmsRules,
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id", permissions('admin'),validationparmsRules, destroy);

export default router;
