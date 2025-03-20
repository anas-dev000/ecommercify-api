const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Sub category name is required !")
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 3 characters long")
    .isLength({ max: 30 })
    .withMessage("Subcategory name must not exceed 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Category id is required !")
    .isMongoId()
    .withMessage("Invalid Category id !"),

  validatorMiddleware,
];

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id !"),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id !"),
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Subcategory name must be at least 2 characters long")
    .isLength({ max: 30 })
    .withMessage("Subcategory name must not exceed 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  body("category").optional().isMongoId().withMessage("Invalid Category id!"),
  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id !"),
  validatorMiddleware,
];

module.exports = {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
