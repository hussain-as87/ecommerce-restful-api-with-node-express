import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  create,
  destroy,
  index,
  show,
  update, 
} from "../services/BrandService.js";
import {ValidationbodyRulesForCreate,ValidationbodyRulesForUpdate}from "../utils/validations/BrandValidation.js"
const router = express.Router();

router.get("/", index);
router.get("/:id", validationparmsRules, show);
router.post("/", ValidationbodyRulesForCreate, create);
router.put("/:id", validationparmsRules, ValidationbodyRulesForUpdate, update);
router.delete("/:id", validationparmsRules, destroy);

export default router;
