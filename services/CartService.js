import asyncHandler from "express-async-handler";
import {ApiError} from "../utils/apiError.js";
import {Cart} from "../models/Cart.js";
import {Product} from "../models/Product.js";
import {Coupon} from "../models/Coupon.js";

/**
 * @description Get logged user cart
 * @route GET api/vi/cart
 * @access  private (user)
 */
export const index = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        return next(
            new ApiError(`there is not cart for this user id : ${req.user._id}`, 404)
        );
    }
    res.status(200).json({
        status: "success",
        numberCartItems: cart.cartItems.length,
        data: cart,
    });
});

/**
 * @description add product to cart
 * @route POST /api/v1/cart
 * @access private (user)
 */
export const create = asyncHandler(async (req, res, next) => {
    const {productId, color, quantity} = req.body;
    const product = await Product.findById(productId);
    // 1) get cart for auth user
    let cart = await Cart.findOne({user: req.user._id});
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
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;
            cart.cartItems[productIndex] = cartItem;
        } else {
            //product not exist in cart, push product to cartItems array
            cart.cartItems.push({product: productId, color, price: product.price});
        }
        // push prodcut to cartItems arry
    }
    // calculate total cart price
    calculateTotalPrice(cart);

    await cart.save();

    res.status(200).json({
        status: "success",
        message: "product added to cart successfuly.",
        data: cart,
    });
});

/**
 * @description Delete specific product from cart by id
 * @route DELETE api/vi/cart/:id
 * @access  private (user)
 */
export const destroy = asyncHandler(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId not exist
    const cart = await Cart.findOneAndUpdate(
        {user: req.user._id},
        {
            $pull: {cartItems: {_id: req.params.itemId}},
        },
        {new: true}
    );
    calculateTotalPrice(cart);

    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Product removed successfully from your cart.",
        numberCartItems: cart.cartItems.length,
        data: cart,
    });
});

/**
 * @description clear cart from user logged
 * @route DELETE api/vi/cart/
 * @access  private (user)
 */
export const clearCart = asyncHandler(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId not exist
    const cart = await Cart.findOneAndDelete({user: req.user._id});

    if (!cart) {
        return next(new ApiError("you don't have items in your cart"));
    }
    return res.status(200).json({
        status: "success",
        message: "cart clear successfully.",
    });
});

/**
 * @description Update specific cart from user logged
 * @route PUT api/vi/cart/:itemId
 * @access private (user)
 */
export const updateQuantity = asyncHandler(async (req, res, next) => {
    const {quantity} = req.body;
    const cart = await Cart.findOne({user: req.user._id});
    if (!cart) {
        return next(
            new ApiError(`there is no cart for user ${req.user.name}`, 404)
        );
    }
    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );
    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;
        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(new ApiError(`therd is no item with id ${req.params.itemId}`));
    }
    calculateTotalPrice(cart);
    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Product removed successfully from your cart.",
        numberCartItems: cart.cartItems.length,
        data: cart,
    });
});
/**
 * @description apply coupon on cart
 * @route PUT api/vi/cart/applyCoupon
 * @access private (user)
 */
export const applyCoupon = asyncHandler(async (req, res, next) => {
    //1) get coupon based on coupon name
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        expire: {$gt: Date.now()},
    });
    if (!coupon) {
        return next(new ApiError(`there is not coupon with ${req.body.coupon}`));
    }
    //2) get logged user cart to get total cart price
    const cart = await Cart.findOne({user: req.user._id});
    const total = cart.totalCartPrice;

    //3) calculate total after discount
    const totalPriceAfterDiscount = (
        total -
        (total * coupon.discount) / 100
    ).toFixed(2);

    cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
    await cart.save();

    res.status(200).json({
        status: "success",
        numberCartItems: cart.cartItems.length,
        data: cart,
    });
});

const calculateTotalPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((product) => {
        totalPrice += product.quantity * product.price;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};
