const express = require("express");
const router = express.Router();
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  createCashOrder,
  filterOrdersForUsers,
  getOrders,
  getOrderById,
  updateOrderStatus,
  checkoutSession,
} = require("../controllers/orderController");

// Validators
const {
  createOrderValidator,
  orderIdValidator,
} = require("../utils/validators/orderValidator");

router.use(isAuthenticated);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and checkout
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order (Cash)
 *     tags:
 *       - Orders
 *     description: Create a new order using cash on delivery (User only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: "Cairo"
 *                   street:
 *                     type: string
 *                     example: "Tahrir Street"
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router
  .route("/")
  .post(allowedTo("user"), createOrderValidator, createCashOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags:
 *       - Orders
 *     description: Retrieve all orders (User/Admin)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router
  .route("/")
  .get(allowedTo("user", "admin"), filterOrdersForUsers, getOrders);

/**
 * @swagger
 * /api/orders/checkout-session:
 *   get:
 *     summary: Create a Stripe checkout session
 *     tags:
 *       - Orders
 *     description: Generate a Stripe checkout session for online payment (User only)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 */
router.get(
  "/checkout-session",
  allowedTo("user"),
  createOrderValidator,
  checkoutSession
);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order
 *     tags:
 *       - Orders
 *     description: Retrieve details of a specific order (User/Admin)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 */
router.get(
  "/:id",
  allowedTo("user", "admin"),
  orderIdValidator,
  filterOrdersForUsers,
  getOrderById
);

/**
 * @swagger
 * /api/orders/{id}/{action}:
 *   patch:
 *     summary: Update order status (Pay/Deliver)
 *     tags:
 *       - Orders
 *     description: Update the status of an order (Admin only)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pay, deliver]
 *         description: The action to perform (pay/deliver)
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */
router.patch(
  "/:id/:action",
  allowedTo("admin"),
  orderIdValidator,
  updateOrderStatus
);

module.exports = router;
