import {ApiError} from "../utils/apiError.js";
import aysncHandler from "express-async-handler";
import ApiFeatures from "../utils/apiFeatures.js";

export const indexFactory = (model, optionModelName) =>
    aysncHandler(async (req, res) => {
        //filteration
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        //build query
        const countDocument = await model.countDocuments();
        const api_features = new ApiFeatures(model.find(filter), req.query)
            .paginate(countDocument)
            .filters()
            .sort()
            .search(optionModelName)
            .limitFields();
        const {mongooseQuery, paginationResult} = api_features;
        const documents = await mongooseQuery;
        res
            .status(200)
            .json({result: documents.length, paginationResult, data: documents});
    });

export const showFactory = (model, populationOpt) =>
    aysncHandler(async (req, res, next) => {
        const {id} = req.params;
        // 1) Build query
        let query = model.findById(id);
        if (populationOpt) {
            query = query.populate(populationOpt);
        }

        // 2) Execute query
        const document = await query;

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }
        res.status(200).json({data: document});
    });

export const createFactory = (model) =>
    aysncHandler(async (req, res) => {
        const document = await model.create(req.body);
        res.status(201).json({data: document});
    });

export const updateFactory = (model) =>
    aysncHandler(async (req, res, next) => {
        const document = await model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!document) next(new ApiError(`No ${model} with id ${req.params.id}`, 404));
        //triger "save" event when update document
        document.save();
        res.status(200).json({data: document});
    });

export const destroyFactory = (model) =>
    aysncHandler(async (req, res, next) => {
        const {id} = req.params;
        const document = await model.findByIdAndDelete({_id: id});
        if (!document) next(new ApiError(`No ${model} with id ${id}`, 404));
        //triger "remove" event when update document
        document.remove();
        return res.status(204).json({message: `Deleted Successfully ${model} by ${id}`});
    });
