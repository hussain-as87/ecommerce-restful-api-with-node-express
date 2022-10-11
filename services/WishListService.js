import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

/**
 * @description Get list of brands
 * @route GET api/vi/brands
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
 * @route POST api/vi/brands
 * @access private
 */
export const create = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );
  console.log(user.wishlist);
  res.status(200).json({
    status: "success",
    message: "product added successfully to you'r wishlist.",
    data: user.wishlist,
  });
});

/**
 * @description Delete specific product to wishlist by id
 * @route DELETE api/vi/brands/:id
 * @access private
 */
export const destroy = asyncHandler(async (req, res, next) => {
  // $pull => remove productId from wishlist array if productId not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist.",
    data: user.wishlist,
  });
});
