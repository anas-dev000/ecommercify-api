const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const createOrderValidator = [
  body("shippingAddress.alias")
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("Alias must be between 2 and 50 characters"),

  body("shippingAddress.details")
    .isString()
    .isLength({ min: 5, max: 200 })
    .withMessage("Details must be between 5 and 255 characters"),

  body("shippingAddress.street")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("Street must be between 3 and 100 characters"),

  body("shippingAddress.city")
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("shippingAddress.postCode")
    .isString()
    .isLength({ min: 5, max: 10 })
    .withMessage("PostCode must be between 5 and 10 characters"),

  validatorMiddleware,
];

const orderIdValidator = [
  check("id").isMongoId().withMessage("Invalid order ID"),
  validatorMiddleware,
];



module.exports = {
  createOrderValidator,
  orderIdValidator,
};
