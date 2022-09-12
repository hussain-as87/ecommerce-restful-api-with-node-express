import { Brand } from "../models/Brand.js";
import {
  createFactory,
  destroyFactory,
  indexFactory,
  showFactory,
  updateFactory,
} from "./handlersFactory.js";

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
