import asyncHandler from "express-async-handler";
import {User} from "../models/User.js";

/**
 * @description Get list of user addresses
 * @route GET api/vi/address
 * @access private
 */
export const index = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({
        status: "success",
        results: user.addresses.length,
        data: user.addresses,
    });
});

/**
 * @description Create new address
 * @route POST api/vi/address
 * @access private
 */
export const create = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {$addToSet: {addresses: req.body}},
        {new: true}
    );
    console.log(user.wishlist);
    res.status(200).json({
        status: "success",
        message: "address added successfully.",
        data: user.addresses,
    });
});

/**
 * @description Delete specific address by id
 * @route DELETE api/vi/address/:id
 * @access private
 */
export const destroy = asyncHandler(async (req, res, next) => {
    // $pull => remove productId from wishlist array if productId not exist
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {addresses: {_id: req.params.addressId}},
        },
        {new: true}
    );

    return res.status(200).json({
        status: "success",
        message: "address removed successfully.",
        data: user.addresses,
    });
});
