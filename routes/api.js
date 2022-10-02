import express from "express";
import categoryRouter from "./category.js";
import subCategoryRouter from "./subCategory.js";
import BrandRouter from "./brand.js";
import ProductRouter from "./product.js";
import UserRouter from "./user.js";
import AuthRouter from "./auth.js";
import { protect } from "../services/AuthService.js";
export const router = express.Router();

router.use("/categories", protect,categoryRouter);
router.use("/subcategories", protect,subCategoryRouter);
router.use("/brands", protect,BrandRouter);
router.use("/users", protect,UserRouter);
router.use("/products", protect,ProductRouter);

router.use("/auth", AuthRouter);
