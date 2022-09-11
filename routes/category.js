import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  create,
  destroy,
  index,
  show,
  update
} from "../services/CategoryService.js";
import {ValidationbodyRulesForCreate,ValidationbodyRulesForUpdate}from "../utils/validations/categoryValidation.js"

import subcategoriesRoute from "./subCategory.js";

const router = express.Router();


//nested route
router.use("/:categoryId/subcategories", subcategoriesRoute);
router.get("/", index);
router.get("/:id", validationparmsRules, show);
router.post("/", ValidationbodyRulesForCreate, create);
router.put(
  "/:id",
  validationparmsRules,
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id", validationparmsRules, destroy);

export default router;
