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
} from "../utils/validations/UserValidation.js";import {permissions} from "../services/AuthService.js"
const router = express.Router();

router.get("/",permissions('admin'), index);
router.get("/:id",permissions('admin'), validationparmsRules, show);
router.post(
  "/",permissions('admin'),
  [uploadImage, resizeImage],
  ValidationbodyRulesForCreate,
  create
);
router.put(
  "/:id",permissions('admin'),
  [validationparmsRules, uploadImage, resizeImage],
  ValidationbodyRulesForUpdate,
  update
);
router.put("/changePassword/:id", changePasswordValidator, changePassword);
router.delete("/:id",permissions('admin'), validationparmsRules, destroy);

export default router;
