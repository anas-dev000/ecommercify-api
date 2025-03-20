const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const Brand = require("../../models/brandModel");

const createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("name is required !")
    .isLength({ min: 2 })
    .withMessage("minlength is 2 characters")
    .isLength({ max: 30 })
    .withMessage("maxlength is 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    })
    .custom(async (val) => {
      const brand = await Brand.findOne({ name: val });
      if (brand) return Promise.reject("brand name must be unique");
    }),
  check("image").optional(),
  validatorMiddleware,
];

const getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id !"),
  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id !"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("minlength is 3 characters")
    .isLength({ max: 30 })
    .withMessage("maxlength is 30 characters")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    })
    .custom(async (val) => {
      const brand = await Brand.findOne({ name: val });
      if (brand) return Promise.reject("brand name must be unique");
    }),
  body("image").optional(),

  validatorMiddleware,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid brand id!"),
  validatorMiddleware,
];

module.exports = {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
