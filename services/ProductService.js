import asyncHandler from "express-async-handler";
import sharp from "sharp";
import {v4 as uuidv4} from "uuid";
import {Product} from "../models/Product.js";
import {uploadmixOfImages} from "../middlewares/uploadImageMiddleware.js"
import {
    createFactory,
    destroyFactory,
    indexFactory,
    showFactory,
    updateFactory,
} from "./handlersFactory.js";

/**
 * @description upload product images
 */
export const uploadProductImages = uploadmixOfImages([
    {name: "imageCover", maxCount: 1},
    {name: "images", maxCount: 8},
]);

/**
 * @description resize product images
 */
export const resizeProductImages = asyncHandler(async (req, res, next) => {
    // console.log(req.files);
    //1- Image processing for imageCover
    if (req.files.imageCover) {
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`public/uploads/products/${imageCoverFileName}`);

        // Save image into our db
        req.body.imageCover = imageCoverFileName;
    }
    //2- Image processing for images
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({quality: 95})
                    .toFile(`public/uploads/products/${imageName}`);

                // Save image into our db
                req.body.images.push(imageName);
            })
        );

        next();
    }
});

/**
 * @description Get list of products
 * @route GET api/vi/products
 * @access public
 */
export const index = indexFactory(Product, "Product");
/**
 * @description Show specific products by id
 * @route GET api/vi/products/:id
 * @access public
 */
export const show = showFactory(Product, "reviews");

/**
 * @description Create new product
 * @route POST api/vi/products
 * @access private
 */
export const create = createFactory(Product);

/**
 * @description Update specific product by id
 * @route PUT api/vi/products/:id
 * @access private
 */
export const update = updateFactory(Product);
/**
 * @description Delete specific products by id
 * @route PUT api/vi/products/:id
 * @access private
 */
export const destroy = destroyFactory(Product);
