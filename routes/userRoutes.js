const express = require("express");
const router = express.Router();

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
  resizeProfileImage,
} = require("../controllers/userController");

// Validators
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
} = require("../utils/validators/userValidator");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (Admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     description: Retrieve a list of all users (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 */
router.route("/").get(isAuthenticated, allowedTo("admin"), getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     description: Add a new user to the system (Admin only)
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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "StrongPassword123!"
 *               role:
 *                 type: string
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully
 */
router
  .route("/")
  .post(
    isAuthenticated,
    allowedTo("admin"),
    uploadProfileImage,
    createUserValidator,
    resizeProfileImage,
    createUser
  );

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a specific user
 *     tags:
 *       - Users
 *     description: Retrieve details of a single user (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details returned successfully
 */
router
  .route("/:id")
  .get(isAuthenticated, allowedTo("admin"), getUserValidator, getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a specific user
 *     tags:
 *       - Users
 *     description: Modify user details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated User Name"
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router
  .route("/:id")
  .patch(
    isAuthenticated,
    allowedTo("admin"),
    uploadProfileImage,
    updateUserValidator,
    resizeProfileImage,
    updateUser
  );

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a specific user
 *     tags:
 *       - Users
 *     description: Remove a user from the system (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router
  .route("/:id")
  .delete(isAuthenticated, allowedTo("admin"), deleteUserValidator, deleteUser);

module.exports = router;
