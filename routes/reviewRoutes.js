const express = require("express");

// Merge params allows us to access parameters from parent routers.
const router = express.Router({ mergeParams: true });

// Controllers
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
  setProductIdAndUserIdToBody,
} = require("../controllers/reviewController");

// Middlewares for filtering
const { createFilterObject } = require("../middlewares/helpfulMiddlewares");

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Validators
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews management
 */

/**
 * @swagger
 * /api/products/{product}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags:
 *       - Reviews
 *     description: Retrieve a list of reviews for a specific product
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A list of reviews
 */
router.route("/").get(createFilterObject("product"), getAllReviews);

/**
 * @swagger
 * /api/products/{product}/reviews:
 *   post:
 *     summary: Add a new review
 *     tags:
 *       - Reviews
 *     description: Submit a new review for a product (User only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent product!"
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router
  .route("/")
  .post(
    isAuthenticated,
    allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );

/**
 * @swagger
 * /api/products/{product}/reviews/{id}:
 *   get:
 *     summary: Get a specific review
 *     tags:
 *       - Reviews
 *     description: Retrieve details of a specific review
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review details returned successfully
 */
router.route("/:id").get(getReviewValidator, getReviewById);

/**
 * @swagger
 * /api/products/{product}/reviews/{id}:
 *   patch:
 *     summary: Update a review
 *     tags:
 *       - Reviews
 *     description: Modify an existing review (User only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Good product, but can be improved"
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router
  .route("/:id")
  .patch(
    isAuthenticated,
    allowedTo("user"),
    updateReviewValidator,
    updateReview
  );

/**
 * @swagger
 * /api/products/{product}/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags:
 *       - Reviews
 *     description: Remove a specific review (User/Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router
  .route("/:id")
  .delete(
    isAuthenticated,
    allowedTo("user", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
