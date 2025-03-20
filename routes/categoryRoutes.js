const express = require("express");
const router = express.Router();
const subCategoryRoutes = require("../routes/subCategoryRoutes");

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryControllers");

// Validators
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

// Nested routes for sub-categories belonging to a category
/**
 * @swagger
 * /api/categories/{category}/subCategories:
 *   get:
 *     summary: Get all subcategories for a category
 *     tags:
 *       - Categories
 *     description: Retrieve a list of subcategories that belong to a specific category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: A list of subcategories
 */
router.use("/:category/subCategories", subCategoryRoutes);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     description: Retrieve a list of all categories
 *     responses:
 *       200:
 *         description: A list of categories
 */
router.route("/").get(getAllCategories);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     description: Add a new category (Admin only)
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
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router
  .route("/")
  .post(
    isAuthenticated,
    allowedTo("admin"),
    createCategoryValidator,
    createCategory
  );

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a specific category
 *     tags:
 *       - Categories
 *     description: Retrieve details of a single category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category details returned successfully
 */
router.route("/:id").get(getCategoryValidator, getCategoryById);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update a specific category
 *     tags:
 *       - Categories
 *     description: Modify category details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category Name
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router
  .route("/:id")
  .patch(
    isAuthenticated,
    allowedTo("admin"),
    updateCategoryValidator,
    updateCategory
  );

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a specific category
 *     tags:
 *       - Categories
 *     description: Remove a category from the database (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router
  .route("/:id")
  .delete(
    isAuthenticated,
    allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
