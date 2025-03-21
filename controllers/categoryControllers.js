const Category = require("../models/categoryModel");
const handlersController = require("./handlersController");

// Basic Routes (CRUD)

const createCategory = handlersController.createOne(Category);

const getAllCategories = handlersController.getAll(Category);

const getCategoryById = handlersController.getOne(Category);

const updateCategory = handlersController.updateOne(Category);

const deleteCategory = handlersController.deleteOne(Category);

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
