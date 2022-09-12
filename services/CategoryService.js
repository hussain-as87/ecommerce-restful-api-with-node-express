import { Category } from "../models/Category.js";
import {
  createFactory,
  destroyFactory,
  indexFactory,
  showFactory,
  updateFactory,
} from "./handlersFactory.js";

/**
 * @description Get list of categories
 * @route GET api/vi/categories
 * @access public
 */
export const index = indexFactory(Category)
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
