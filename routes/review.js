import express from "express";

import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";

 import {
  ValidationbodyRulesForCreate,
  ValidationbodyRulesForDelete,
  ValidationbodyRulesForUpdate,
} from "../utils/validations/ReviewValidation.js";
import { permissions, protect } from "../services/AuthService.js";
import {
  create,
  createFilterObj,
  destroy,
  index,
  setProductIdAndUserIdToBody,
  show,
  update,
} from "../services/ReviewService.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, index)
  .post(
    protect,
    permissions("user"),
    setProductIdAndUserIdToBody,
     ValidationbodyRulesForCreate,
     create
  );
router
  .route("/:id")
  .get(validationparmsRules("id"), show)
  .put(protect, permissions("user"),  ValidationbodyRulesForUpdate,  update)
  .delete(
    protect,
    permissions("user", "manager", "admin"),
     ValidationbodyRulesForDelete,
     destroy
  );

export default router;
