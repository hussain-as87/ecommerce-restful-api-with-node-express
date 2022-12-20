import {SubCategory} from "../models/SubCategory.js";

import {
    createFactory,
    destroyFactory,
    indexFactory,
    showFactory,
    updateFactory,
} from "./handlersFactory.js";

/**
 * @description middleware for Set category id from params
 * @access public
 */
export const setCategoryId = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};
/**
 * @description middleware for Set category id from params
 * @access public
 */
export const createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId) {
        filterObject = {category: req.params.categoryId};
        req.filterObject = filterObject;
    }
    next();
};

/**
 * @description Get list of subcategories
 * @route GET api/vi/subcategories
 * @access public
 */
export const index = indexFactory(SubCategory);

/**
 * @description Show specific subcategories by id
 * @route GET api/vi/subcategories/:id
 * @access public
 */
export const show = showFactory(SubCategory);

/**
 * @description Create new subcategories
 * @route POST api/vi/subcategories
 * @access private
 */
export const create = createFactory(SubCategory);

/**
 * @description Update specific subcategories by id
 * @route PUT api/vi/subcategories/:id
 * @access private
 */
export const update = updateFactory(SubCategory);
/**
 * @description Delete specific subcategories by id
 * @route PUT api/vi/subcategories/:id
 * @access private
 */
export const destroy = destroyFactory(SubCategory);
