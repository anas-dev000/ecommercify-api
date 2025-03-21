const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const { createToken } = require("../utils/createToken");
const User = require("../models/userModel");

// # Profile Data Controllers
const getMyData = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const updateMyData = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const deleteMyAccount = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

const updateMyPassword = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const isSamePassword = await user.matchPassword(req.body.newPassword);
  if (isSamePassword) {
    return next(
      new ApiError("The new password must be different from the old one.", 400)
    );
  }

  user.password = req.body.newPassword;

  const token = createToken(user._id);
  res.status(200).json({ token });
});

// # Profile Addresses Controllers
const getMyAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});

const addMyAddress = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        addresses: req.body,
      },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Your Address added successfully.",
    data: user.addresses,
  });
});

const updateMyAddress = asyncHandler(async (req, res) => {
  const updateFields = {};

  // Prepare the fields that will be updated based on the values ​​coming from the user
  Object.keys(req.body).forEach((key) => {
    updateFields[`addresses.$.${key}`] = req.body[key];
  });

  const user = await User.findOneAndUpdate(
    { _id: req.user._id, "addresses._id": req.params.addressId },
    { $set: updateFields },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Address not found.",
    });
  }

  res.status(200).json({
    status: "success",
    message: "This Address updated successfully.",
    data: user.addresses,
  });
});

const deleteMyAddress = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { addresses: { _id: req.params.addressId } },
  });

  res.status(200).json({
    status: "success",
    message: "This Address deleted successfully.",
  });
});

module.exports = {
  getMyData,
  updateMyData,
  deleteMyAccount,
  updateMyPassword,
  addMyAddress,
  deleteMyAddress,
  getMyAddresses,
  updateMyAddress,
};
