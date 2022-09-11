import { Category } from "../models/Category.js";
import slugify from "slugify";
import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/ValidatorMiddleware.js";
import ApiFeatures from "../utils/dummyData/apiFeatures.js";

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
export const update = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name: name, slug: slugify(name) },
    { new: true }
  );
  if (!category) next(new ApiError(`No Category with id ${id}`, 404));
  res.status(200).json({ data: category });
});
/**
 * @description Delete specific category by id
 * @route PUT api/vi/categories/:id
 * @access private
 */
export const destroy = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete({ _id: id });
  if (!category) next(new ApiError(`No Category with id ${id}`, 404));
  res.status(204).json({ message: `Deleted Successfully category by ${id}` });
});

export const ValidationbodyRulesForCreate = [
  check("name")
    .notEmpty()
    .withMessage("category name is required !")
    .isString()
    .withMessage("Category name must be string !")
    .isLength({ min: 3 })
    .withMessage("Category name is too short !")
    .isLength({ max: 32 })
    .withMessage("Category name is too long !"),
  validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
  check("name")
    .isString()
    .withMessage("Category name must be string !")
    .isLength({ min: 3 })
    .withMessage("Category name is too short !")
    .isLength({ max: 32 })
    .withMessage("Category name is too long !"),
  validatorMiddleware,
];
