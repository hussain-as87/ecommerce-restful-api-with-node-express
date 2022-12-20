import AsyncHandler from "express-async-handler";
import sharp from "sharp";
import {uploadSingleImage} from "../middlewares/uploadImageMiddleware.js";
import {Brand} from "../models/Brand.js";
import {
    createFactory,
    destroyFactory,
    indexFactory,
    showFactory,
    updateFactory,
} from "./handlersFactory.js";
import {v4 as uuidv4} from "uuid";

/**
 * @description upload image
 */
export const uploadImage = uploadSingleImage("image");

/**
 * @description upload image
 */
export const resizeImage = AsyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 90})
            .toFile(`public/uploads/brands/${filename}`);
        //save image in Database
        req.body.image = filename;
    }
    next();
});
/**
 * @description Get list of brands
 * @route GET api/vi/brands
 * @access public
 */
export const index = indexFactory(Brand);
/**
 * @description Show specific brands by id
 * @route GET api/vi/brands/:id
 * @access public
 */
export const show = showFactory(Brand);

/**
 * @description Create new brand
 * @route POST api/vi/brands
 * @access private
 */
export const create = createFactory(Brand);

/**
 * @description Update specific brand by id
 * @route PUT api/vi/brands/:id
 * @access private
 */
export const update = updateFactory(Brand);
/**
 * @description Delete specific brand by id
 * @route PUT api/vi/brands/:id
 * @access private
 */
export const destroy = destroyFactory(Brand);
