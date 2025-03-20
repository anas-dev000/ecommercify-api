const SubCategory = require("../models/subCategoryModel");
const handlersController = require("./handlersController");

// @DESC Creates a new SubCategory
// @route Post /api/subCategories
// @access Private

const createSubCategory = handlersController.createOne(SubCategory);

// @DESC Get list of subCategories
// @route Get /api/subCategories
// @access public
const getAllSubCategories = handlersController.getAll(SubCategory);

// @DESC Get specific subCategory
// @route Get /api/subCategories/:id
// @access public

const getSubCategoryById = handlersController.getOne(SubCategory);

// @DESC Update specific subCategory
// @route put /api/subCategories/:id
// @access Private

const updateSubCategory = handlersController.updateOne(SubCategory);

// @DESC Delete specific subCategory
// @route Delete /api/subCategories/:id
// @access Private

const deleteSubCategory = handlersController.deleteOne(SubCategory);

// Nested route
// @route POST /api/categories/:category/subCategories
// DOCS   If you do not send the ID to the category in the Body with the name of the subCategory
//        I will take the ID that is in the API Route and POST it.
//        In case of POST request

const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.category;
  next();
};

module.exports = {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
};
