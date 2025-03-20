const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const addAddressValidator = [
  body("alias")
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("Alias must be between 2 and 50 characters"),
  body("details")
    .isString()
    .isLength({ min: 5, max: 255 })
    .withMessage("Details must be between 5 and 255 characters"),
  body("street")
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("Street must be between 3 and 100 characters"),
  body("city")
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  body("postCode")
    .isString()
    .isLength({ min: 5, max: 10 })
    .withMessage("PostCode must be between 5 and 10 characters"),
  validatorMiddleware,
];

const updateAddressValidator = [
  body("alias")
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("Alias must be between 2 and 50 characters"),
  body("details")
    .optional()
    .isString()
    .isLength({ min: 5, max: 255 })
    .withMessage("Details must be between 5 and 255 characters"),
  body("street")
    .optional()
    .isString()
    .isLength({ min: 3, max: 100 })
    .withMessage("Street must be between 3 and 100 characters"),
  body("city")
    .optional()
    .isString()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  body("postCode")
    .optional()
    .isString()
    .isLength({ min: 5, max: 10 })
    .withMessage("PostCode must be between 5 and 10 characters"),
  validatorMiddleware,
];

const deleteAddressValidator = [
  check("addressId").isMongoId().withMessage("Invalid address id!"),
  validatorMiddleware,
];

module.exports = {
  addAddressValidator,
  deleteAddressValidator,
  updateAddressValidator,
};
