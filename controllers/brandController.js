const Brand = require("../models/brandModel");
const handlersController = require("./handlersController");

const {
  uploadSingleImage,
  resizeImage,
} = require("../middlewares/imageMiddlewares");

// Upload single image
const uploadBrandImage = uploadSingleImage("image");

// Image processing
const resizeBrandImage = resizeImage("image", "brands");

// Basic Routes (CRUD)

const createBrand = handlersController.createOne(Brand);

const getAllBrands = handlersController.getAll(Brand);

const getBrandById = handlersController.getOne(Brand);

const updateBrand = handlersController.updateOne(Brand);

const deleteBrand = handlersController.deleteOne(Brand);

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
};
