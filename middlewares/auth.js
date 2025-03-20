const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");

exports.isAuthenticated = asyncHandler(async (req, res, next) => {
  // 1) check if the authorization header is not existing
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    return next(new ApiError("Authorization header is missing", 401));
  }

  // 2) check if the token is not existing
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new ApiError("Token is not provided", 401));
  }

  // 3) check if the token is valid
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decoded) {
    return next(new ApiError("Invalid token", 401));
  }

  // 4) check if the user is not existing in token
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist",
        401
      )
    );
  }
  // 5) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again..",
          401
        )
      );
    }
  }

  // 6) Check if user is active
  if (!currentUser.isActive) {
    return next(
      new ApiError(
        "Your account has been deactivated. Please log in again to reactivate your account.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });
