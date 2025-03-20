const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ApiError = require("../utils/apiError");
const handlersController = require("./handlersController");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @route POST /api/cart
const addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  // Check the product exist and the color that the user has chosen
  const query = { _id: productId };
  if (color) query.colors = color;

  const product = await Product.findOne(query);

  if (!product || product.quantity === 0)
    return next(new ApiError("Product not found", 404));

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, price: product.price, color }],
    });
  } else {
    const productIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.items[productIndex];
      cartItem.quantity += quantity;
      cart.items[productIndex] = cartItem;
    } else
      cart.items.push({
        product: productId,
        quantity,
        color,
        price: product.price,
      });
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "The product has been successfully added to your cart.",
    data: { cart },
  });
});

// @route GET /api/cart
const getMyCart = handlersController.getAll(Cart);

// @route PATCH /api/cart/:productId
const updateMyCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity, color } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new ApiError("Cart not found", 404));

  // Search for the product in the cart
  const productIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (productIndex === -1)
    return next(new ApiError("Product not found in cart", 404));

  // Search for the original product in the database
  const product = await Product.findById(productId);
  if (!product) return next(new ApiError("Product not found", 404));

  //Check that the entered color is available for the product.
  if (color) {
    if (!product.colors.includes(color)) {
      return next(
        new ApiError(`Color "${color}" is not available for this product`, 400)
      );
    }
    cart.items[productIndex].color = color;
  }

  //Check that the entered quantity is available for the product
  if (quantity !== undefined) {
    if (quantity < 1) {
      return next(new ApiError("Quantity must be at least 1", 400));
    }
    if (quantity > product.quantity) {
      return next(
        new ApiError(`Only ${product.quantity} items available`, 400)
      );
    }
    cart.items[productIndex].quantity = quantity;
  }

  // Update total price and save changes
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    data: { cart },
  });
});

// @route DELETE /api/cart/:itemId
const deleteItemFromMyCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) return next(new ApiError("Cart not found", 404));
  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex === -1)
    return next(new ApiError("Item not found in cart", 404));

  cart.items.splice(itemIndex, 1);

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item removed from cart successfully",
    data: { cart },
  });
});

// @route PATCH /api/cart/applyCoupon
const applyCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode } = req.body;
  const coupon = await Coupon.findOne({
    name: couponCode,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;

  const totalPriceAfterDiscount =
    totalPrice - (totalPrice * coupon.discount) / 100;
  //toFixed(2) -> 0.00
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount.toFixed(2);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: { cart },
  });
});

// @route DELETE /api/cart
const clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

module.exports = {
  addToCart,
  getMyCart,
  updateMyCart,
  deleteItemFromMyCart,
  applyCoupon,
  clearCart,
};
