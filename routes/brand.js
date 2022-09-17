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
} from "../services/BrandService.js";
import {
  ValidationbodyRulesForCreate,
  ValidationbodyRulesForUpdate,
} from "../utils/validations/BrandValidation.js";
const router = express.Router();

router.get("/", index);
router.get("/:id", validationparmsRules, show);
router.post(
  "/",
  [uploadImage, resizeImage],
  ValidationbodyRulesForCreate,
  create
);
router.put(
  "/:id",
  [validationparmsRules, uploadImage, resizeImage],
  ValidationbodyRulesForUpdate,
  update
);
router.delete("/:id", validationparmsRules, destroy);

export default router;
