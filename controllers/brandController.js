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

// @DESC Create a new brand
// @route Post /api/brands
// @access Private

const createBrand = handlersController.createOne(Brand);

// @DESC Get all brands
// @route Get /api/brands
// @access Public

const getAllBrands = handlersController.getAll(Brand);
// @DESC Get specific brand
// @route Get /api/brands/:id
// @access Private

const getBrandById = handlersController.getOne(Brand);

// @DESC Update specific brand
// @route Put /api/brands/:id
// @access Private

const updateBrand = handlersController.updateOne(Brand);

// @DESC Delete specific brand
// @route Delete /api/brands/:id
// @access Private

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
