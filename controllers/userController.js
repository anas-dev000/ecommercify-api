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

// Basic Routes (CRUD)

const createUser = handlersController.createOne(User);

const getAllUsers = handlersController.getAll(User);

const getUserById = handlersController.getOne(User);

const updateUser = handlersController.updateOne(User);

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
