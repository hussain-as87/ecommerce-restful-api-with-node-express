import AsyncHandler from "express-async-handler";
import sharp from "sharp";
import {uploadSingleImage} from "../middlewares/uploadImageMiddleware.js";
import {Banner} from "../models/Banner.js";
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
    try {
        const filename = `banner-${uuidv4()}-${Date.now()}.png`;
        if (req.file) {
            await sharp(req.file.buffer).toFormat("png")
                .toFile(`public/uploads/banners/${filename}`);
            //save image in Database
            req.body.image = filename;
        }
        next();
    } catch (error) {
        console.error("Error while resizing and saving image:", error);
        next(error); // Pass the error to the next middleware
    }
});

/**
 * @description Get list of banners
 * @route GET api/vi/banners
 * @access public
 */
export const index = indexFactory(Banner);
/**
 * @description Show specific banners by id
 * @route GET api/vi/banners/:id
 * @access public
 */
export const show = showFactory(Banner);

/**
 * @description Create new banner
 * @route POST api/vi/banners
 * @access private
 */
export const create = createFactory(Banner);

/**
 * @description Update specific banner by id
 * @route PUT api/vi/banners/:id
 * @access private
 */
export const update = updateFactory(Banner);
/**
 * @description Delete specific banner by id
 * @route PUT api/vi/banners/:id
 * @access private
 */
export const destroy = destroyFactory(Banner);
