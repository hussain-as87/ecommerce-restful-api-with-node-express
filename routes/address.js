import express from "express";
import { validationparmsRules } from "../middlewares/ValidatorMiddleware.js";
const router = express.Router();
import { permissions } from "../services/AuthService.js";
import { create, destroy, index } from "../services/AddressService.js";
/* import { createaddressValidation } from "../utils/validations/AddressValidation.js";
 */
router.get("/", index);

router.post("/", [permissions("user")/* , createaddressValidation */], create);
router.delete(
  "/:addressId",
  [validationparmsRules("addressId"), permissions("user")],
  destroy
);

export default router;

