import express from "express";
// eslint-disable-next-line import/extensions
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  create,
  destroy,
  index,
  show,
  update,
  ValidationbodyRulesForCreate,
  ValidationbodyRulesForUpdate,
} from "../services/ProductService.js";
const router = express.Router();


//nested route
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
