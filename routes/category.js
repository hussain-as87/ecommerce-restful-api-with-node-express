import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  create,
  destroy,
  index,
  resizeImage,
  show,
  update,
  uploadImage,
} from "../services/CategoryService.js";

import {permissions} from "../services/AuthService.js"
import subcategoriesRoute from "./subCategory.js";
import { ValidationbodyRulesForCreate, ValidationbodyRulesForUpdate } from "../utils/validations/CategoryValidation.js";
const router = express.Router();

//nested route
router.use("/:categoryId/subcategories", subcategoriesRoute);
router.get("/", index);
router.get("/:id", validationparmsRules("id"), show);
router.post("/",permissions('admin','maneger'), [uploadImage,resizeImage],ValidationbodyRulesForCreate, create);
router.put("/:id",permissions('admin','maneger'), [validationparmsRules("id"),uploadImage,resizeImage], ValidationbodyRulesForUpdate, update);
router.delete("/:id", permissions('admin'),validationparmsRules("id"), destroy);

export default router;
