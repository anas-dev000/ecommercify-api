const Review = require("../models/reviewModel");
const handlersController = require("./handlersController");

// Basic Routes (CRUD)
const createReview = handlersController.createOne(Review);

const getAllReviews = handlersController.getAll(Review);

const getReviewById = handlersController.getOne(Review);

const updateReview = handlersController.updateOne(Review);

const deleteReview = handlersController.deleteOne(Review);

//Nested Route
// GET /api/v1/products/:product/reviews
const setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.product;
  if (!req.body.user) req.body.user = req.user._id;

  console.log("Received Data in setProductIdAndUserIdToBody:", req.body);
  next();
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody,
};
