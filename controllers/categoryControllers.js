const Category = require("../models/categoryModel");
const handlersController = require("./handlersController");

// @DESC Creates a new category
// @route Post /api/categories
// @access Private

const createCategory = handlersController.createOne(Category);

// @DESC Get list of categories
// @route Get /api/categories
// @access Public

const getAllCategories = handlersController.getAll(Category);

// @DESC Get specific category
// @route Get /api/categories/:id
// @access Public

const getCategoryById = handlersController.getOne(Category);

// @DESC Update specific category
// @route Put /api/categories/:id
// @access Private

const updateCategory = handlersController.updateOne(Category);

// @DESC Delete specific category
// @route Delete /api/categories/:id
// @access Private

const deleteCategory = handlersController.deleteOne(Category);

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
