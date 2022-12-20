import {Review} from "../models/Review.js";
import {
    createFactory,
    destroyFactory,
    indexFactory,
    showFactory,
    updateFactory,
} from "./handlersFactory.js";
// Nested route
// GET /api/v1/products/:productId/reviews
export const createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = {product: req.params.productId};
    req.filterObj = filterObject;
    next();
};

/**
 *@desc    Get list of reviews
 *@route   GET /api/v1/reviews
 *@access  Public*/
export const index = indexFactory(Review);

/**
 *@desc    Get specific review by id
 *@route   GET /api/v1/reviews/:id
 *@access  Public
 */
export const show = showFactory(Review);

// Nested route (Create)
export const setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};
/**
 *@desc    Create review
 *@route   POST  /api/v1/reviews
 *@access  Private/Protect/User
 */
export const create = createFactory(Review);

/**
 * @desc    Update specific review
 * @route   PUT /api/v1/reviews/:id
 * @access  Private/Protect/User
 */
export const update = updateFactory(Review);

/**
 * @desc    Delete specific review
 *@route   DELETE /api/v1/reviews/:id
 *@access  Private/Protect/User-Admin-Manager
 */
export const destroy = destroyFactory(Review);
