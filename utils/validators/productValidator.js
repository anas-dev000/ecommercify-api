const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");
const mongoose = require("mongoose");
const slugify = require("slugify");

// Common ID Validator
const checkMongoId = (field) =>
  check(field).isMongoId().withMessage("Invalid ID format");

// Validate SubCategories
const validateSubCategories = (subCategoriesIDs, { req }) => {
  subCategoriesIDs = [...new Set(subCategoriesIDs)]; // Remove duplicates

  if (!subCategoriesIDs.every((id) => mongoose.Types.ObjectId.isValid(id))) {
    throw new Error("Invalid SubCategory ID format");
  }

  return SubCategory.find({ _id: { $in: subCategoriesIDs } }).then(
    (foundSubCategories) => {
      if (foundSubCategories.length !== subCategoriesIDs.length) {
        throw new Error(
          `Some SubCategory IDs are not found: ${subCategoriesIDs}`
        );
      }
      return SubCategory.find({ category: req.body.category }).then(
        (categorySubs) => {
          const categorySubIds = categorySubs.map((sub) => sub._id.toString());
          if (!subCategoriesIDs.every((id) => categorySubIds.includes(id))) {
            throw new Error(
              `Provided subcategories do not belong to the specified category`
            );
          }
        }
      );
    }
  );
};

const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required!")
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters")
    .trim()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  body("description")
    .notEmpty()
    .withMessage("Product description is required!")
    .isLength({ min: 20, max: 500 })
    .withMessage("Description must be between 20 and 500 characters")
    .trim(),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required!")
    .isInt({ min: 1 })
    .withMessage("Must be a number greater than 0"),

  body("sold").optional().isNumeric().withMessage("Must be a number"),

  body("price")
    .notEmpty()
    .withMessage("Price is required!")
    .isFloat({ min: 1, max: 100000 })
    .withMessage("Price must be between 1 and 100,000"),

  body("priceAfterDiscount")
    .optional()
    .isFloat()
    .withMessage("Must be a numeric value")
    .custom((value, { req }) => {
      if (req.body.price && req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  body("images")
    .optional()
    .isArray()
    .withMessage("Must be an array of strings"),

  body("colors")
    .optional()
    .isArray()
    .withMessage("Must be an array of strings"),

  checkMongoId("category").custom((categoryId) =>
    Category.findById(categoryId).then((category) => {
      if (!category) {
        return Promise.reject(
          new Error(`Category not found by ID: ${categoryId}`)
        );
      }
    })
  ),

  body("subCategories")
    .notEmpty()
    .withMessage("Subcategories are required!")
    .custom(validateSubCategories),

  checkMongoId("brand").optional(),

  body("ratingAverage")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Must be between 1 and 5"),

  body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Must be a numeric value"),

  validatorMiddleware,
];

const updateProductValidator = [
  checkMongoId("id"),

  body("name")
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage("Product name must be between 3 and 100 characters")
    .trim()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  body("description")
    .optional()
    .isLength({ min: 20, max: 500 })
    .withMessage("Description must be between 20 and 500 characters"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Must be a number greater than 0"),

  body("sold").optional().isNumeric().withMessage("Must be a number"),

  body("price")
    .optional()
    .isFloat({ min: 1, max: 100000 })
    .withMessage("Must be between 1 and 100,000"),

  body("priceAfterDiscount")
    .optional()
    .isFloat()
    .withMessage("Must be a numeric value")
    .custom((value, { req }) => {
      if (req.body.price && req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  body("imageCover").optional(),

  body("images").optional().isArray().withMessage("Must be an array"),

  body("colors").optional().isArray().withMessage("Must be an array"),

  body("subCategories").optional().custom(validateSubCategories),

  validatorMiddleware,
];

const deleteProductValidator = [checkMongoId("id"), validatorMiddleware];
const getProductValidator = [checkMongoId("id"), validatorMiddleware];

module.exports = {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
