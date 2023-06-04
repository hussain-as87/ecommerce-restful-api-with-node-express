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
 */export const uploadProductImages = uploadmixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 6 },
]);

export const resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  // 1) Image Process for imageCover
  if (req.files.imageCover) {
    const ext = req.files.imageCover[0].mimetype.split("/")[1];
    const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.${ext}`;
    await sharp(req.files.imageCover[0].buffer)
      // .resize(2000, 1333)
      // .toFormat('jpeg')
      // .jpeg({ quality: 90 })
      .toFile(`public/uploads/products/${imageCoverFilename}`); // write into a file on the disk

    // Save imageCover into database
    req.body.imageCover = imageCoverFilename;
  }
  req.body.images = [];
  // 2- Image processing for images
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const ext = img.mimetype.split("/")[1];
        const filename = `products-${uuidv4()}-${Date.now()}-${
          index + 1
        }.${ext}`;
        await sharp(img.buffer)
          // .resize(800, 800)
          // .toFormat('jpeg')
          // .jpeg({ quality: 90 })
          .toFile(`public/uploads/products/${filename}`);

        // Save images into database
        req.body.images.push(filename);
      })
    );
  }

  // console.log(req.body.imageCover);
  // console.log(req.body.images);
  next();
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
