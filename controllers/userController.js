const User = require("../models/userModel");
const handlersController = require("./handlersController");

const {
  uploadSingleImage,
  resizeImage,
} = require("../middlewares/imageMiddlewares");

// Upload single image
const uploadProfileImage = uploadSingleImage("profileImage");

// Image processing
const resizeProfileImage = resizeImage("profileImage", "users");

// @DESC Create a new User
// @route Post /api/Users
// @access Private
const createUser = handlersController.createOne(User);

// @DESC Get all Users
// @route Get /api/Users
// @access Private
const getAllUsers = handlersController.getAll(User);

// @DESC Get specific User
// @route Get /api/Users/:id
// @access Private
const getUserById = handlersController.getOne(User);

// @DESC Update specific User
// @route Put /api/Users/:id
// @access Private
const updateUser = handlersController.updateOne(User);

// @DESC Delete specific User
// @route Delete /api/Users/:id
// @access Private
const deleteUser = handlersController.deleteOne(User);

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  uploadProfileImage,
  resizeProfileImage,
};
