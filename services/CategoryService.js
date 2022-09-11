import { Category } from "../models/Category.js";
import slugify from "slugify";
import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteFactory, updateFactory } from "./handlersFactory.js";

/**
 * @description Get list of categories
 * @route GET api/vi/categories
 * @access public
 */
export const index = aysncHandler(async (req, res) => {
  const countDocument = await Category.countDocuments();
  const api_features = new ApiFeatures(Category.find(), req.query)
    .paginate(countDocument)
    .filters()
    .sort()
    .search()
    .limitFields();
  const { mongooseQuery, paginationResult } = api_features;
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ result: categories.length, paginationResult, data: categories });
});
/**
 * @description Show specific category by id
 * @route GET api/vi/categories/:id
 * @access public
 */
export const show = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    next(new ApiError(`No Category with id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

/**
 * @description Create new category
 * @route POST api/vi/categories
 * @access private
 */
export const create = aysncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name: name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

/**
 * @description Update specific category by id
 * @route PUT api/vi/categories/:id
 * @access private
 */
export const update = updateFactory(Category)
/**
 * @description Delete specific category by id
 * @route PUT api/vi/categories/:id
 * @access private
 */
export const destroy = deleteFactory(Category);

