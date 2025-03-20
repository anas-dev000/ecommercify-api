const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

const createUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("Please enter your name")
    .isLength({ min: 3 })
    .withMessage("Your name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val, { lower: true });
      return true;
    }),

  body("email")
    .notEmpty()
    .withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) return Promise.reject("This email is already in use");
    }),

  body("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 8 })
    .withMessage("Your password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirmation) {
        return Promise.reject("Password Confirmation incorrect");
      }
      return true;
    }),

  body("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation required"),

  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number! Only Egyptian and Saudi numbers are accepted."
    ),

  body("profileImage").optional(),
  body("role").optional(),
  validatorMiddleware,
];

const getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware,
];

const updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Your name must be at least 3 characters")
    .custom((val, { req }) => {
      req.body.slug = val ? slugify(val, { lower: true }) : undefined;
      return true;
    }),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) return Promise.reject("This email is already in use");
    }),

  body("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone number! Only Egyptian and Saudi numbers are accepted."
    ),

  body("profileImage").optional(),
  body("role").optional(),
  validatorMiddleware,
];

const deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID format"),
  validatorMiddleware,
];

module.exports = {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
};
