const express = require("express");
const router = express.Router();
const { isAuthenticated, allowedTo } = require("../middlewares/auth");

// Controllers
const {
  addToCart,
  getMyCart,
  updateMyCart,
  deleteItemFromMyCart,
  applyCoupon,
  clearCart,
} = require("../controllers/cartController");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

router.use(isAuthenticated, allowedTo("user"));

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags:
 *       - Cart
 *     description: Add a product to the cart (User only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "6123456789abcdef01234567"
 *               color:
 *                 type: string
 *                 example: "red"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 */
router.route("/").post(addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags:
 *       - Cart
 *     description: Retrieve the current user's cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully
 */
router.route("/").get(getMyCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear user's cart
 *     tags:
 *       - Cart
 *     description: Remove all items from the user's cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       204:
 *         description: Cart cleared successfully
 */
router.route("/").delete(clearCart);

/**
 * @swagger
 * /api/cart/applyCoupon:
 *   patch:
 *     summary: Apply a discount coupon
 *     tags:
 *       - Cart
 *     description: Apply a coupon to the user's cart (User only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               couponCode:
 *                 type: string
 *                 example: "DISCOUNT10"
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 */
router.route("/applyCoupon").patch(applyCoupon);

/**
 * @swagger
 * /api/cart/{productId}:
 *   patch:
 *     summary: Update product quantity in cart
 *     tags:
 *       - Cart
 *     description: Update the quantity of a product in the cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully
 */
router.route("/:productId").patch(updateMyCart);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove an item from cart
 *     tags:
 *       - Cart
 *     description: Remove a specific item from the cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID in the cart
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 */
router.route("/:itemId").delete(deleteItemFromMyCart);

module.exports = router;
