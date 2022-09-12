import { Product } from "../models/Product.js";
import {
  createFactory,
  destroyFactory,
  indexFactory,
  showFactory,
  updateFactory,
} from "./handlersFactory.js";

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
export const show = showFactory(Product);

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
