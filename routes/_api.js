//import path from "path";
import express from "express";
import categoryRouter from "./category.js";
import subCategoryRouter from "./subCategory.js";
import BrandRouter from "./brand.js";
import ProductRouter from "./product.js";
import UserRouter from "./user.js";
import AuthRouter from "./auth.js";
import ReviewRouter from "./review.js";
import WishListRouter from "./wishList.js";
import AddressRouter from "./address.js";
import CouponRouter from "./coupon.js";
import CartRouter from "./cart.js";
import OrderRouter from "./order.js";
import {protect} from "../services/AuthService.js";
import {webhookCheckout} from "../services/OrderService.js";
/*import swaggerUi from "swagger-ui-express";
 import swagDocs from "./../swagger.json" assert { type: "json" };
 */
export const router = express.Router();

router.use("/categories", categoryRouter);
router.use("/subcategories", subCategoryRouter);
router.use("/brands", BrandRouter);
router.use("/users", protect, UserRouter);
router.use("/products", ProductRouter);
router.use("/reviews",ReviewRouter);
router.use("/wishlist", protect, WishListRouter);
router.use("/address", protect, AddressRouter);
router.use("/coupons", protect, CouponRouter);
router.use("/cart", protect, CartRouter);
router.use("/orders", protect, OrderRouter);
router.use("/auth", AuthRouter);

// Stripe requires the raw body to construct the event
router.post('/webhook-checkout', express.raw({type: 'application/json'}), webhookCheckout);

//swagger for testing Api
/* router.use("/docs", swaggerUi.serve, swaggerUi.setup(swagDocs));
 */

