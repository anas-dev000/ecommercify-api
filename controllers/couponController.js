const Coupon = require("../models/couponModel");
const handlersController = require("./handlersController");

// Basic Routes (CRUD)

const createCoupon = handlersController.createOne(Coupon);

const getAllCoupons = handlersController.getAll(Coupon);

const getCouponById = handlersController.getOne(Coupon);

const updateCoupon = handlersController.updateOne(Coupon);

const deleteCoupon = handlersController.deleteOne(Coupon);

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
