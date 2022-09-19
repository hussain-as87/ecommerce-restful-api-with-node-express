import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
import {
  changePassword,
  create,
  destroy,
  index,
  resizeImage,
  show,
  update,
  uploadImage,
} from "../services/UserService.js";
import {
  ValidationbodyRulesForCreate,
  ValidationbodyRulesForUpdate,
  changePasswordValidator,
} from "../utils/validations/UserValidation.js";
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
router.put("/changePassword/:id", changePasswordValidator, changePassword);
router.delete("/:id", validationparmsRules, destroy);

export default router;
