import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  create,
  createFilterObj,
  destroy,
  index,
  setCategoryId,
  show,
  update
} from "../services/SubCategoryService.js";
import {ValidationbodyRulesForCreate,ValidationbodyRulesForUpdate}from "../utils/validations/subCategoryValidation.js"
import {permissions} from "../services/AuthService.js"
// to allow us to access parameters on other routes
const router = express.Router({ mergeParams: true });

router.get("/",createFilterObj ,index);
router.get("/:id", validationparmsRules, show);
router.post("/",permissions('admin','maneger'),[setCategoryId, ValidationbodyRulesForCreate], create);
router.put(
  "/:id",permissions('admin','maneger'),
  validationparmsRules,
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id",permissions('admin'), validationparmsRules, destroy);
/* apple */

export default router;
