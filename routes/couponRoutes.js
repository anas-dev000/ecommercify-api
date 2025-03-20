const express = require("express");
const router = express.Router();

// Middlewares authentication and authorization
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} = require("../controllers/couponController");

// Validators
const {
  getCouponValidator,
  createCouponValidator,
  updateCouponValidator,
  deleteCouponValidator,
} = require("../utils/validators/couponValidator");

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management endpoints
 */

router.use(isAuthenticated, allowedTo("admin"));

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all coupons
 *     tags:
 *       - Coupons
 *     description: Retrieve a list of all coupons (Admin only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of coupons
 */
router.route("/").get(getAllCoupons);

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags:
 *       - Coupons
 *     description: Add a new discount coupon (Admin only)
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
 *                 example: "DISCOUNT10"
 *               discount:
 *                 type: number
 *                 example: 10
 *               expire:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       201:
 *         description: Coupon created successfully
 */
router.route("/").post(createCouponValidator, createCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   get:
 *     summary: Get a specific coupon
 *     tags:
 *       - Coupons
 *     description: Retrieve details of a single coupon (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The coupon ID
 *     responses:
 *       200:
 *         description: Coupon details returned successfully
 */
router.route("/:id").get(getCouponValidator, getCouponById);

/**
 * @swagger
 * /api/coupons/{id}:
 *   patch:
 *     summary: Update a specific coupon
 *     tags:
 *       - Coupons
 *     description: Modify coupon details (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "NEW_DISCOUNT"
 *               discount:
 *                 type: number
 *                 example: 15
 *               expire:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-01"
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 */
router.route("/:id").patch(updateCouponValidator, updateCoupon);

/**
 * @swagger
 * /api/coupons/{id}:
 *   delete:
 *     summary: Delete a specific coupon
 *     tags:
 *       - Coupons
 *     description: Remove a coupon from the database (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 */
router.route("/:id").delete(deleteCouponValidator, deleteCoupon);

module.exports = router;
