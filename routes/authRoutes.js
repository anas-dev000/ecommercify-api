const express = require("express");
const router = express.Router();

// Controllers
const {
  signUp,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../controllers/authController");

// Validators
const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidator");

const { isAuthenticated } = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and account management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     description: Authenticate user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.route("/login").post(loginValidator, login);

/**
 * @swagger
 * /api/auth/signUp:
 *   post:
 *     summary: User registration
 *     tags:
 *       - Authentication
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.route("/signUp").post(signupValidator, signUp);

/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Forgot password
 *     tags:
 *       - Authentication
 *     description: Send a reset code to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset code sent successfully
 */
router.route("/forgotPassword").post(forgotPassword);

/**
 * @swagger
 * /api/auth/verifyResetCode:
 *   post:
 *     summary: Verify reset password code
 *     tags:
 *       - Authentication
 *     description: Verify the reset code sent to the email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Reset code verified successfully
 */
router.route("/verifyResetCode").post(verifyPassResetCode);

/**
 * @swagger
 * /api/auth/resetPassword:
 *   patch:
 *     summary: Reset password
 *     tags:
 *       - Authentication
 *     description: Reset user password after verification
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
 *                 example: NewPassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router
  .route("/resetPassword")
  .patch(isAuthenticated, resetPasswordValidator, resetPassword);

module.exports = router;
