import { SubCategory } from "../models/SubCategory.js";
import slugify from "slugify";
import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteFactory, updateFactory } from "./handlersFactory.js";

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
    filterObject = { category: req.params.categoryId };
    req.filterObject = filterObject;
  }
  next();
};

/**
 * @description Get list of subcategories
 * @route GET api/vi/subcategories
 * @access public
 */
export const index = aysncHandler(async (req, res) => {
  const countDocument = await SubCategory.countDocuments();
  const api_features = new ApiFeatures(
    SubCategory.find().populate({ path: "category", select: "name =_id" }),
    req.query
  )
    .paginate(countDocument)
    .filters()
    .sort()
    .search()
    .limitFields();
  const { mongooseQuery, paginationResult } = api_features;
  const subcategories = await mongooseQuery;
  res.status(200).json({
    result: subcategories.length,
    paginationResult,
    data: subcategories,
  });
});

/**
 * @description Show specific subcategories by id
 * @route GET api/vi/subcategories/:id
 * @access public
 */
export const show = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findById(id).populate({
    path: "category",
    select: "name =_id",
  });
  if (!subcategory) {
    next(new ApiError(`No SubCategory with id ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

/**
 * @description Create new subcategories
 * @route POST api/vi/subcategories
 * @access private
 */
export const create = aysncHandler(async (req, res) => {
  const { name, category } = req.body;
  const sucategory = await SubCategory.create({
    name: name,
    slug: slugify(name),
    category: category,
  });
  res.status(201).json({ data: sucategory });
});

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
export const destroy = deleteFactory(SubCategory);


