const express = require("express");
const router = express.Router();
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Middlewares
const { editUserActivity } = require("../middlewares/helpfulMiddlewares");

// Validators
const { resetPasswordValidator } = require("../utils/validators/authValidator");

// Controllers
const {
  getMyData,
  updateMyData,
  deleteMyAccount,
  updateMyPassword,
  addMyAddress,
  deleteMyAddress,
  getMyAddresses,
  updateMyAddress,
} = require("../controllers/meController");

const {
  getUserById,
  updateUser,
  uploadProfileImage,
  resizeProfileImage,
} = require("../controllers/userController");

const {
  addAddressValidator,
  deleteAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressValidator");

router.use(isAuthenticated);

/**
 * @swagger
 * tags:
 *   name: User Profile
 *   description: User profile and address management
 */

/**
 * @swagger
 * /api/me:
 *   get:
 *     summary: Get user profile
 *     tags:
 *       - User Profile
 *     description: Retrieve the current authenticated user's profile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 */
router.route("/").get(getMyData, getUserById);

/**
 * @swagger
 * /api/me:
 *   patch:
 *     summary: Update user profile
 *     tags:
 *       - User Profile
 *     description: Update the current authenticated user's profile
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
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */
router
  .route("/")
  .patch(updateMyData, uploadProfileImage, resizeProfileImage, updateUser);

/**
 * @swagger
 * /api/me:
 *   delete:
 *     summary: Delete user account
 *     tags:
 *       - User Profile
 *     description: Delete the current authenticated user's account
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 */
router.route("/").delete(deleteMyAccount, editUserActivity, updateUser);

/**
 * @swagger
 * /api/me/update-password:
 *   patch:
 *     summary: Update user password
 *     tags:
 *       - User Profile
 *     description: Change the password of the authenticated user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.patch("/update-password", resetPasswordValidator, updateMyPassword);

// Addresses
router.use(allowedTo("user"));

/**
 * @swagger
 * /api/me/addresses:
 *   post:
 *     summary: Add a new address
 *     tags:
 *       - User Profile
 *     description: Add a new address to the user's profile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: "Cairo"
 *               street:
 *                 type: string
 *                 example: "Tahrir Street"
 *     responses:
 *       200:
 *         description: Address added successfully
 */
router.route("/addresses").post(addAddressValidator, addMyAddress);

/**
 * @swagger
 * /api/me/addresses:
 *   get:
 *     summary: Get user addresses
 *     tags:
 *       - User Profile
 *     description: Retrieve all addresses of the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Addresses retrieved successfully
 */
router.route("/addresses").get(getMyAddresses);

/**
 * @swagger
 * /api/me/addresses/{addressId}:
 *   patch:
 *     summary: Update an address
 *     tags:
 *       - User Profile
 *     description: Update a specific address of the authenticated user
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 example: "Alexandria"
 *               street:
 *                 type: string
 *                 example: "Corniche Road"
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.route("/addresses/:addressId").patch(updateAddressValidator, updateMyAddress);

/**
 * @swagger
 * /api/me/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags:
 *       - User Profile
 *     description: Remove a specific address from the user's profile
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: The address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.route("/addresses/:addressId").delete(deleteAddressValidator, deleteMyAddress);

module.exports = router;
