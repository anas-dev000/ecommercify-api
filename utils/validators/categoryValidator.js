const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required !")
    .isLength({ min: 3 })
    .withMessage("minlength is 3 characters")
    .isLength({ max: 30 })
    .withMessage("maxlength is 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

const getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id !"),
  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id !"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("minlength is 3 characters")
    .isLength({ max: 30 })
    .withMessage("maxlength is 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id !"),
  validatorMiddleware,
];

module.exports = {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
