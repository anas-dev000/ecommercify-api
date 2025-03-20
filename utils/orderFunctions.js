const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// Function to save a new address for the user if it is not a duplicate
const saveUserNewAddress = async (user, shippingAddress) => {
  if (
    !user.addresses.some(
      (addr) => JSON.stringify(addr) === JSON.stringify(shippingAddress)
    )
  ) {
    user.addresses.push(shippingAddress);
    await user.save();
  }
};

/**
 * Process order completion steps:
 * 1. Update product quantities and sales count.
 * 2. Remove the cart after successful order placement.
 * 3. Save the new shipping address to the user's address list.
 **/
const processOrderCompletion = async (order, cart, user, shippingAddress) => {
  if (!order || !cart || !user) return;
  await Promise.all([
    Product.bulkWrite(
      cart.items.map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
        },
      }))
    ),
    Cart.findByIdAndDelete(cart._id),
    saveUserNewAddress(user, shippingAddress),
  ]);
};

// Function to creates a new order after a successful card payment
const createCardOrder = async (session) => {
  if (!session || session.payment_status !== "paid") return;
  if (!session.client_reference_id) return;

  const cart = await Cart.findById(session.client_reference_id);
  const user = await User.findOne({ email: session.customer_details.email });
  if (!cart || !user) return;

  const shippingAddress = {
    street: session.metadata.street,
    details: session.metadata.details,
    city: session.metadata.city,
    postCode: session.metadata.postCode,
    alias: session.metadata.alias,
  };

  try {
    const order = await Order.create({
      user: user._id,
      cartItems: cart.items,
      totalOrderPrice: session.amount_total / 100,
      shippingAddress,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethodType: "card",
    });

    await processOrderCompletion(order, cart, user, session.metadata);
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

module.exports = {
  processOrderCompletion,
  createCardOrder,
};
