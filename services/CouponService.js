import { Coupon } from "../models/Coupon.js";
import {
  createFactory,
  destroyFactory,
  indexFactory,
  showFactory,
  updateFactory,
} from "./handlersFactory.js";


/**
 * @description Get list of coupons
 * @route GET api/vi/coupons
 * @access public
 */
export const index = indexFactory(Coupon);
/**
 * @description Show specific coupons by id
 * @route GET api/vi/coupons/:id
 * @access public
 */
export const show = showFactory(Coupon);

/**
 * @description Create new coupon
 * @route POST api/vi/coupons
 * @access private
 */
export const create = createFactory(Coupon);

/**
 * @description Update specific coupon by id
 * @route PUT api/vi/coupons/:id
 * @access private
 */
export const update = updateFactory(Coupon);
/**
 * @description Delete specific coupon by id
 * @route DELETE api/vi/coupons/:id
 * @access private
 */
export const destroy = destroyFactory(Coupon);
