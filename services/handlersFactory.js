import { ApiError } from "../utils/apiError.js";
import aysncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";

export const deleteFactory = (model) =>
  aysncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await model.findByIdAndDelete({ _id: id });
    if (!document) next(new ApiError(`No ${model} with id ${id}`, 404));
    res.status(204).json({ message: `Deleted Successfully ${model} by ${id}` });
  });

export const updateFactory = (model) =>
  aysncHandler(async (req, res, next) => {
    const document = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) next(new ApiError(`No ${model} with id ${id}`, 404));
    res.status(200).json({ data: document });
  });
