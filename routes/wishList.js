import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
const router = express.Router();
import { permissions } from "../services/AuthService.js";
import { create, destroy, index } from "../services/WishListService.js";
import { createwishlistValidation } from "../utils/validations/wishlistValidation.js";

router.get("/", index);

router.post("/", [permissions("user"), createwishlistValidation], create);
router.delete(
  "/:productId",
  [validationparmsRules("productId"), permissions("user")],
  destroy
);

export default router;

