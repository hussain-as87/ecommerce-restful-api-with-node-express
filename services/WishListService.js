import asyncHandler from "express-async-handler";
import {User} from "../models/User.js";

/**
 * @description Get list of wishlist
 * @route GET api/vi/wishlist
 * @access private
 */
export const index = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("wishlist");

    res.status(200).json({
        status: "success",
        results: user.wishlist.length,
        data: user.wishlist,
    });
});

/**
 * @description Create new product to wishlist
 * @route POST api/vi/wishlist
 * @access private
 */
export const create = asyncHandler(async (req, res, next) => {
    // $addToSet => add productId to wishlist array if productId not exist

    const user = await User.findByIdAndUpdate(
        req.user._id,
        {$addToSet: {wishlist: req.body.productId}},
        {new: true}
    );
    res.status(200).json({
        status: "success",
        message: "product added successfully to you'r wishlist.",
        data: user.wishlist,
    });
});

/**
 * @description Delete specific product from wishlist by id
 * @route DELETE api/vi/wishlist/:id
 * @access private
 */
export const destroy = asyncHandler(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId not exist
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {wishlist: req.params.productId},
        },
        {new: true}
    );

    return res.status(204).json({
        status: "success",
        message: "Product removed successfully from your wishlist.",
        data: user.wishlist,
    });
});
