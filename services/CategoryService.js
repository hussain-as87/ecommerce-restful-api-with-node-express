import { Category } from "../models/Category.js";
import {
  createFactory,
  destroyFactory,
  indexFactory,
  showFactory,
  updateFactory,
} from "./handlersFactory.js";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";

/**
 * @description upload image
 */
export const uploadImage = uploadSingleImage("image");

/**
 * @description upload image
 */
export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/uploads/categories/${filename}`);
  //save image in Database
  req.body.image = filename;
  next();
});

/**
 * @description Get list of categories
 * @route GET api/vi/categories
 * @access public
 */
export const index = indexFactory(Category);
/**
 * @description Show specific category by id
 * @route GET api/vi/categories/:id
 * @access public
 */
export const show = showFactory(Category);

/**
 * @description Create new category
 * @route POST api/vi/categories
 * @access private
 */
export const create = createFactory(Category);

/**
 * @description Update specific category by id
 * @route PUT api/vi/categories/:id
 * @access private
 */
export const update = updateFactory(Category);
/**
 * @description Delete specific category by id
 * @route PUT api/vi/categories/:id
 * @access private
 */
export const destroy = destroyFactory(Category);
