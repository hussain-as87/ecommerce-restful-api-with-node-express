import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

/**
 * @description add product to cart
 * @route POST /api/v1/cart
 * @access private (user)
 */
export const create = aysncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  const product = await Product.findById(productId);
  // 1) get cart for auth user
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    //create carty for auth user
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          quantity: quantity,
          color,
          price: product.price,
        },
      ],
    });
  } else {
    //product exist in cart update quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    console.log(productIndex);
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    }
    // push prodcut to cartItems arry
  }
  await cart.save();
});
