const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const ApiError = require("../utils/apiError");
const handlersController = require("./handlersController");

const {
  processOrderCompletion,
  createCardOrder,
} = require("../utils/orderFunctions");

// Middleware to filter requests so that the normal user only sees their requests
const filterOrdersForUsers = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObject = { user: req.user._id };
  next();
});

// @route   GET /api/orders
const getOrders = handlersController.getAll(Order);

// @route   GET /api/orders/:id
const getOrderById = handlersController.getOne(Order);

// @route   POST /api/orders
const createCashOrder = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || !cart.items.length)
    return next(new ApiError("Cart is empty", 400));

  const order = await Order.create({
    user: req.user._id,
    cart: cart._id,
    cartItems: cart.items,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: cart.totalPriceAfterDiscount || cart.totalCartPrice,
  });

  await processOrderCompletion(order, cart, req.user, req.body.shippingAddress);
  res.status(201).json({ status: "success", data: order });
});

// @route   PATCH /api/orders/:id/pay
// @route   PATCH /api/orders/:id/deliver
// @access  Protected/Admin
const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { id, action } = req.params;
  const order = await Order.findById(id);

  if (!order) return next(new ApiError("Order not found", 404));

  const updates = {};
  if (action === "pay") {
    updates.isPaid = true;
    updates.paidAt = Date.now();
  } else if (action === "deliver") {
    updates.isDelivered = true;
    updates.deliveredAt = Date.now();
  } else {
    return next(new ApiError("Invalid action", 400));
  }

  Object.assign(order, updates);
  await order.save();

  res.status(200).json({ status: "success", data: order });
});

// @route   GET /api/orders/checkout-session
// @access  Protected/User
const checkoutSession = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || !cart.items.length) {
    return next(new ApiError("Cart is empty", 400));
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: { name: req.user.name },
          unit_amount:
            (cart.totalPriceAfterDiscount || cart.totalCartPrice) * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/cart`,
    customer_email: req.user.email,
    client_reference_id: cart._id.toString(),
    metadata: req.body.shippingAddress || {},
  });

  res.status(200).json({ status: "success", data: session });
});

// This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
const webhookCheckout = asyncHandler(async (req, res) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (
      event.type === "checkout.session.completed" ||
      event.type === "charge.succeeded"
    ) {
      await createCardOrder(event.data.object);
    }
    res.status(200).json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

module.exports = {
  createCashOrder,
  filterOrdersForUsers,
  getOrders,
  getOrderById,
  updateOrderStatus,
  checkoutSession,
  webhookCheckout,
};
