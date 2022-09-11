import { Brand } from "../models/Brand.js";
import slugify from "slugify";
import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteFactory, updateFactory } from "./handlersFactory.js";

/**
 * @description Get list of brands
 * @route GET api/vi/brands
 * @access public
 */
export const index = aysncHandler(async (req, res) => {
  const countDocument = await Brand.countDocuments();
  const api_features = new ApiFeatures(Brand.find(), req.query)
    .paginate(countDocument)
    .filters()
    .sort()
    .search()
    .limitFields();
  const { mongooseQuery, paginationResult } = api_features;
  const brands = await mongooseQuery;
  res
    .status(200)
    .json({ result: brands.length, paginationResult, data: brands });
});
/**
 * @description Show specific brands by id
 * @route GET api/vi/brands/:id
 * @access public
 */
export const show = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);
  if (!brand) {
    next(new ApiError(`No Brand with id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

/**
 * @description Create new brand
 * @route POST api/vi/brands
 * @access private
 */
export const create = aysncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name: name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

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
export const destroy = deleteFactory(Brand);

