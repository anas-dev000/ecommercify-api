const express = require("express");
const router = express.Router();

const { jsonFormatHandler } = require("../middlewares/helpfulMiddlewares");

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  resizeImageCoverImage,
} = require("../controllers/productController");

// Validators
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

// Sub-router for reviews
/**
 * @swagger
 * /api/products/{product}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags:
 *       - Products
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
const reviewRoute = require("./reviewRoutes");
router.use("/:product/reviews", reviewRoute);

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     description: Retrieve a list of all products
 *     responses:
 *       200:
 *         description: A list of products
 */
router.route("/").get(getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     description: Add a new product (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "iPhone 15"
 *               price:
 *                 type: number
 *                 example: 1200
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "Latest Apple iPhone with A16 chip"
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router
  .route("/")
  .post(
    isAuthenticated,
    allowedTo("admin"),
    jsonFormatHandler,
    uploadProductImages,
    createProductValidator,
    resizeImageCoverImage,
    resizeProductImages,
    createProduct
  );

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a specific product
 *     tags:
 *       - Products
 *     description: Retrieve details of a single product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details returned successfully
 */
router.route("/:id").get(getProductValidator, getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a specific product
 *     tags:
 *       - Products
 *     description: Modify product details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               price:
 *                 type: number
 *                 example: 2200
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router
  .route("/:id")
  .patch(
    isAuthenticated,
    allowedTo("admin"),
    jsonFormatHandler,
    uploadProductImages,
    updateProductValidator,
    resizeImageCoverImage,
    resizeProductImages,
    updateProduct
  );

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a specific product
 *     tags:
 *       - Products
 *     description: Remove a product from the database (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router
  .route("/:id")
  .delete(
    isAuthenticated,
    allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
