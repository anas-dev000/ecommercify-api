const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const ApiError = require("../utils/apiError");

const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    if (Array.isArray(req.body.imageCover)) {
      req.body.imageCover = req.body.imageCover[0];
    }

    console.log("Received Data in createOne:", req.body);
    const newDocument = await Model.create(req.body);
    res.status(201).json({ status: "success", data: newDocument });
  });

const getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const Documents = await Model.findById(id);
    if (!Documents) {
      return next(new ApiError(`Documents not found by id ${id}`, 404));
    }
    res.status(200).json({ status: "success", data: Documents });
  });

const getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const filter = req.filterObject || {};
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search();
    const totalDocs = await Model.countDocuments(
      apiFeatures.mongooseQuery.getFilter()
    );

    apiFeatures.sort().limitFields().paginate(totalDocs);
    const Documents = await apiFeatures.mongooseQuery;

    res.status(200).json({
      status: "success",
      results: Documents.length,
      pagination: apiFeatures.paginationResult,
      data: Documents,
    });
  });

const updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const Document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!Document)
      return next(new ApiError(`Document not found by id ${id}`, 404));
    res.status(200).json({ status: "success", data: Document });
  });

const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const Document = await Model.findByIdAndDelete(id);
    if (!Document)
      return next(new ApiError(`Document not found by id ${id}`, 404));
    res.status(200).json({ status: "success", message: "Document deleted" });
  });

module.exports = { deleteOne, updateOne, createOne, getAll, getOne };
