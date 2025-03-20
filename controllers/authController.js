const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");
const {createToken} = require("../utils/createToken");



const signUp = asyncHandler(async (req, res) => {
  const newUser = await User.create(req.body);
  // 2- Generate token
  const token = createToken(newUser._id);
  res.status(201).json({ status: "success", data: newUser, token });
});

const login = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  //Activate the account if the user deactivated it
  if (user.isActive === false) {
    user.isActive = true;
    await user.save();
  }

  const token = createToken(user._id);

  res.status(200).json({ status: "success", token });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `
    Hi ${user.name},\nWe received a request to reset the password on your E-shop Account.\n${resetCode}\nEnter this code to complete the reset.\n`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});

const verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  const resetToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "10m",
    }
  );

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
    resetToken,
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on token from auth middleware
  user = req.user;

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
    return next(
      new ApiError(
        "The reset code has not been verified or the password has already been changed.",
        400
      )
    );
  }

  // 3) check if the new password is different from the old one.
  const isSamePassword = await user.matchPassword(req.body.newPassword);
  if (isSamePassword) {
    return next(
      new ApiError("The new password must be different from the old one.", 400)
    );
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});

module.exports = {
  signUp,
  login,
  forgotPassword,
  verifyPassResetCode,
  resetPassword,
};
