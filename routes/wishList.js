import express from "express";
import {validationparmsRules} from "../middlewares/ValidatorMiddleware.js";
import {permissions} from "../services/AuthService.js";
import {create, destroy, index} from "../services/WishListService.js";

import {createwishlistValidation} from "../utils/validations/WishlistValidation.js";


const router = express.Router();

router.get("/", index);

router.post("/", [permissions("user","admin","manager"), createwishlistValidation], create);
router.delete(
    "/:productId",
    [validationparmsRules("productId"), permissions("user")],
    destroy
);

export default router;

