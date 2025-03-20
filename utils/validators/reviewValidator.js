const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

// Common ID Validator
const checkMongoId = (field) =>
  check(field).isMongoId().withMessage("Invalid ID format");

// Check if Review not found
const findReview = async (id) => {
  const review = await Review.findById(id);
  if (!review) {
    throw new Error(`There is no review with id ${id}`);
  }
  return review;
};

// Validate Create Review
const createReviewValidator = [
  (req, res, next) => {
    console.log("Received Data in createReviewValidator:", req.body);
    next();
  },
  body("title").optional(),
  body("ratings")
    .notEmpty()
    .withMessage("review ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("review ratings must be between 1 and 5"),

  checkMongoId("user").notEmpty().withMessage("user id is required"),
  checkMongoId("product")
    .notEmpty()
    .withMessage("product id is required")
    .custom(async (val, { req }) => {
      // Check if logged user create review before
      const review = await Review.findOne({
        user: req.user._id,
        product: req.body.product,
      });
      if (review) {
        throw new Error("You already created a review before");
      }
    }),
  validatorMiddleware,
];

// Validate Update Review
const updateReviewValidator = [
  checkMongoId("id").custom(async (id, { req }) => {
    const review = await findReview(id);
    if (review.user._id.toString() !== req.user._id.toString()) {
      throw new Error(`You are not allowed to perform this action`);
    }
  }),
  validatorMiddleware,
];

// Validate Delete Review
const deleteReviewValidator = [
  checkMongoId("id").custom(async (id, { req }) => {
    const review = await findReview(id);
    if (review.user._id.toString() !== req.user._id.toString()) {
      throw new Error(`You are not allowed to perform this action`);
    }
  }),
  validatorMiddleware,
];

// Validate Get Review
const getReviewValidator = [checkMongoId("id"), validatorMiddleware];

module.exports = {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
