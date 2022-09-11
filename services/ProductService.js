import { Product } from "../models/Product.js";
import slugify from "slugify";
import aysncHandler from "express-async-handler";
import { ApiError } from "../utils/apiError.js";
import ApiFeatures from "../utils/apiFeatures.js";
import { deleteFactory, updateFactory } from "./handlersFactory.js";

/**
 * @description Get list of products
 * @route GET api/vi/products
 * @access public
 */
export const index = aysncHandler(async (req, res) => {
  const countDocument = await Product.countDocuments();
  const api_features = new ApiFeatures(Product.find(), req.query)
    .paginate(countDocument)
    .filters()
    .sort()
    .search("Product")
    .limitFields();
  const { mongooseQuery, paginationResult } = api_features;
  const products = await mongooseQuery;
  res
    .status(200)
    .json({ result: products.length, paginationResult, data: products });
});
/**
 * @description Show specific products by id
 * @route GET api/vi/products/:id
 * @access public
 */
export const show = aysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    next(new ApiError(`No Product with id ${id}`, 404));
  }
  res.status(200).json({ data: product });
});

/**
 * @description Create new product
 * @route POST api/vi/products
 * @access private
 */
export const create = aysncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

/**
 * @description Update specific product by id
 * @route PUT api/vi/products/:id
 * @access private
 */
export const update = updateFactory(Product);
/**
 * @description Delete specific products by id
 * @route PUT api/vi/products/:id
 * @access private
 */
export const destroy = deleteFactory(Product);
