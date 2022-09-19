import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { User } from "../models/User.js";
import {
  createFactory,
  destroyFactory,
  indexFactory,
  showFactory,
} from "./handlersFactory.js";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../utils/apiError.js";
/**
 * @description upload image
 */
export const uploadImage = uploadSingleImage("profileImg");

/**
 * @description upload image
 */
export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/uploads/users/${filename}`);
    //save image in Database
    req.body.profileImg = filename;
  }

  next();
});
/**
 * @description Get list of brands
 * @route GET api/vi/brands
 * @access public
 */
export const index = indexFactory(User);
/**
 * @description Show specific brands by id
 * @route GET api/vi/brands/:id
 * @access public
 */
export const show = showFactory(User);

/**
 * @description Create new user
 * @route POST api/vi/brands
 * @access private
 */
export const create = createFactory(User);

/**
 * @description Update specific user by id
 * @route PUT api/vi/brands/:id
 * @access private
 */
export const update = asyncHandler(async (req, res, next) => {
  const { name, slug, phone, profileImg, role } = req.body;
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: name,
      slug: slug,
      phone: phone,
      profileImg: profileImg,
      role: role,
    },
    {
      new: true,
    }
  );
  if (!document) next(new ApiError(`No ${User} with id ${id}`, 404));
  res.status(200).json({ data: document });
});

/**
 * @description Update password specific user by id
 * @route PUT api/vi/brands/:id
 * @access private
 */
export const changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
/**
 * @description Delete specific user by id
 * @route PUT api/vi/brands/:id
 * @access private
 */
export const destroy = destroyFactory(User);
