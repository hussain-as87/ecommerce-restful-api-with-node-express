import express from "express";
import categoryRouter from "./category.js";
import subCategoryRouter from "./subCategory.js";
import BrandRouter from "./brand.js";
import ProductRouter from "./product.js";
import UserRouter from "./user.js";
import AuthRouter from "./auth.js";
export const router = express.Router();

router.use("/categories", categoryRouter);
router.use("/subcategories", subCategoryRouter);
router.use("/brands", BrandRouter);
router.use("/users", UserRouter);
router.use("/products", ProductRouter);

router.use("/auth", AuthRouter);
