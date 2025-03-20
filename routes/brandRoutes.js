const express = require("express");
const router = express.Router();

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeBrandImage,
} = require("../controllers/brandController");

// Validators
const {
  createBrandValidator,
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand management endpoints
 */

/**
 * @swagger
 * /api/brands:
 *   get:
 *     summary: Get all brands
 *     tags:
 *       - Brands
 *     description: Retrieve a list of all brands
 *     responses:
 *       200:
 *         description: A list of brands
 */
router.route("/").get(getAllBrands);

/**
 * @swagger
 * /api/brands:
 *   post:
 *     summary: Create a new brand
 *     tags:
 *       - Brands
 *     description: Add a new brand (Admin only)
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
 *                 example: Apple
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router
  .route("/")
  .post(
    isAuthenticated,
    allowedTo("admin"),
    uploadBrandImage,
    createBrandValidator,
    resizeBrandImage,
    createBrand
  );

/**
 * @swagger
 * /api/brands/{id}:
 *   get:
 *     summary: Get a specific brand
 *     tags:
 *       - Brands
 *     description: Retrieve details of a single brand
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Brand details returned successfully
 */
router.route("/:id").get(getBrandValidator, getBrandById);

/**
 * @swagger
 * /api/brands/{id}:
 *   patch:
 *     summary: Update a specific brand
 *     tags:
 *       - Brands
 *     description: Modify brand details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Brand Name
 *     responses:
 *       200:
 *         description: Brand updated successfully
 */
router
  .route("/:id")
  .patch(
    isAuthenticated,
    allowedTo("admin"),
    uploadBrandImage,
    updateBrandValidator,
    resizeBrandImage,
    updateBrand
  );

/**
 * @swagger
 * /api/brands/{id}:
 *   delete:
 *     summary: Delete a specific brand
 *     tags:
 *       - Brands
 *     description: Remove a brand from the database (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The brand ID
 *     responses:
 *       200:
 *         description: Brand deleted successfully
 */
router
  .route("/:id")
  .delete(
    isAuthenticated,
    allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
