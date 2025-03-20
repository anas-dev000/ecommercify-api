const express = require("express");

// Merge params allows us to access parameters from parent routers.
const router = express.Router({ mergeParams: true });

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
} = require("../controllers/subCategoryControllers");

// Validators
const {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// Middlewares
const { createFilterObject } = require("../middlewares/helpfulMiddlewares");

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Subcategory management endpoints
 */

/**
 * @swagger
 * /api/categories/{category}/subCategories:
 *   get:
 *     summary: Get all subcategories for a category
 *     tags:
 *       - Subcategories
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
router.route("/").get(createFilterObject("category"), getAllSubCategories);

/**
 * @swagger
 * /api/categories/{category}/subCategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags:
 *       - Subcategories
 *     description: Add a new subcategory under a specific category (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
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
 *                 example: "Smartphones"
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 */
router
  .route("/")
  .post(
    isAuthenticated,
    allowedTo("admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );

/**
 * @swagger
 * /api/subCategories/{id}:
 *   get:
 *     summary: Get a specific subcategory
 *     tags:
 *       - Subcategories
 *     description: Retrieve details of a single subcategory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory details returned successfully
 */
router.route("/:id").get(getSubCategoryValidator, getSubCategoryById);

/**
 * @swagger
 * /api/subCategories/{id}:
 *   patch:
 *     summary: Update a specific subcategory
 *     tags:
 *       - Subcategories
 *     description: Modify subcategory details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subcategory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Subcategory Name"
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 */
router
  .route("/:id")
  .patch(
    isAuthenticated,
    allowedTo("admin"),
    updateSubCategoryValidator,
    updateSubCategory
  );

/**
 * @swagger
 * /api/subCategories/{id}:
 *   delete:
 *     summary: Delete a specific subcategory
 *     tags:
 *       - Subcategories
 *     description: Remove a subcategory from the database (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subcategory ID
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 */
router
  .route("/:id")
  .delete(
    isAuthenticated,
    allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
