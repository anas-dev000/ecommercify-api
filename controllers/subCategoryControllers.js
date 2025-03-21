const SubCategory = require("../models/subCategoryModel");
const handlersController = require("./handlersController");

// Basic Routes (CRUD)

const createSubCategory = handlersController.createOne(SubCategory);

const getAllSubCategories = handlersController.getAll(SubCategory);

const getSubCategoryById = handlersController.getOne(SubCategory);

const updateSubCategory = handlersController.updateOne(SubCategory);

const deleteSubCategory = handlersController.deleteOne(SubCategory);

// Nested route
// @route POST /api/categories/:category/subCategories
/* DOCS   
      If you do not send the ID to the category in the Body with the name of the subCategory
      I will take the ID that is in the API Route and POST it.
      In case of POST request
*/

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
