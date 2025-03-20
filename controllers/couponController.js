const Coupon = require("../models/couponModel");
const handlersController = require("./handlersController");

// @DESC Creates a new Coupon
// @route Post /api/coupons
// @access Private/admin

const createCoupon = handlersController.createOne(Coupon);

// @DESC Get list of coupons
// @route Get /api/coupons
// @access Private/admin

const getAllCoupons = handlersController.getAll(Coupon);

// @DESC Get specific Coupon
// @route Get /api/coupons/:id
// @access Private/admin

const getCouponById = handlersController.getOne(Coupon);

// @DESC Update specific Coupon
// @route Put /api/coupons/:id
// @access Private/admin

const updateCoupon = handlersController.updateOne(Coupon);

// @DESC Delete specific Coupon
// @route Delete /api/coupons/:id
// @access Private/admin

const deleteCoupon = handlersController.deleteOne(Coupon);

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
