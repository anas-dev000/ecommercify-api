const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Coupon = require("../../models/couponModel");

const createCouponValidator = [
  body("name")
    .notEmpty()
    .withMessage("name is required !")
    .isLength({ min: 3 })
    .withMessage("minlength is 3 characters")
    .isLength({ max: 30 })
    .withMessage("maxlength is 30 characters")
    .custom(async (value) => {
      const exists = await Coupon.exists({ name: value });
      if (exists) {
        throw new Error("Coupon name must be unique");
      }
      return true;
    }),

  body("discount")
    .notEmpty()
    .withMessage("Discount is required!")
    .isFloat({ min: 0, max: 100 }),

  body("expire")
    .notEmpty()
    .withMessage("Coupon expire time required")
    .isISO8601()
    .withMessage("Invalid date format")
    .isAfter(new Date().toISOString())
    .withMessage("Coupon expire time must be in the future"),

  validatorMiddleware,
];

const getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id !"),
  validatorMiddleware,
];

const updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id !"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("minlength is 3 characters")
    .isLength({ max: 30 })
    .withMessage("maxlength is 30 characters")
    .custom(async (value) => {
      const exists = await Coupon.exists({ name: value });
      if (exists) {
        throw new Error("Coupon name must be unique");
      }
      return true;
    }),

  body("discount").optional().isFloat({ min: 0, max: 100 }),

  body("expire")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .isAfter(new Date().toISOString())
    .withMessage("Coupon expire time must be in the future"),

  validatorMiddleware,
];

const deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon id !"),
  validatorMiddleware,
];

module.exports = {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
};
