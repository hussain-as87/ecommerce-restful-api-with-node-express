import { SubCategory } from "../models/SubCategory.js";
import slugify from "slugify";
import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/ValidatorMiddleware.js";

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
  let page = req.query.page * 1 || 1;
  let limit = req.query.limit * 1 || 5;
  let skip = (page - 1) * limit;
  const subcategories = await SubCategory.find(req.filterObject)
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name =_id" });
  res.status(200).json({ result: subcategories.length, data: subcategories });
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
export const update = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subcategory = await SubCategory.findByIdAndUpdate(
    id,
    { name: name, slug: slugify(name), category: category },
    { new: true }
  );
  if (!subcategory) next(new ApiError(`No SubCategory with id ${id}`, 404));
  res.status(200).json({ data: subcategory });
});
/**
 * @description Delete specific subcategories by id
 * @route PUT api/vi/subcategories/:id
 * @access private
 */
export const destroy = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findByIdAndDelete(id);
  if (!subcategory) next(new ApiError(`No SubCategory with id ${id}`, 404));
  res
    .status(204)
    .send({ message: `Deleted Successfully SubCategory by ${id}` });
});

export const ValidationbodyRulesForCreate = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name is required !")
    .isString()
    .withMessage("SubCategory name must be string !")
    .isLength({ min: 3 })
    .withMessage("SubCategory name is too short !")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too long !"),
  check("category")
    .notEmpty()
    .withMessage("category parent is required !")
    .isMongoId()
    .withMessage("category id is Uncorrect !"),
  validatorMiddleware,
];
export const ValidationbodyRulesForUpdate = [
  check("name")
    .isString()
    .withMessage("SubCategory name must be string !")
    .isLength({ min: 3 })
    .withMessage("SubCategory name is too short !")
    .isLength({ max: 32 })
    .withMessage("SubCategory name is too long !"),
  check("category")
    .notEmpty()
    .withMessage("category parent is required !")
    .isMongoId()
    .withMessage("category id is Uncorrect !"),
  validatorMiddleware,
];
