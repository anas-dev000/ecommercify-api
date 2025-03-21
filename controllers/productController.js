const Product = require("../models/productModel");
const handlersController = require("./handlersController");
const {
  resizeImage,
  uploadMixOfImages,
} = require("../middlewares/imageMiddlewares");

// Upload multiple images
const uploadProductImages = uploadMixOfImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

// Image processing one image
const resizeImageCoverImage = resizeImage("imageCover", "products");

const resizeProductImages = resizeImage("images", "products");

// Basic Routes (CRUD)

const createProduct = handlersController.createOne(Product);

const getAllProducts = handlersController.getAll(Product);

const getProductById = handlersController.getOne(Product);

const updateProduct = handlersController.updateOne(Product);

const deleteProduct = handlersController.deleteOne(Product);

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  resizeImageCoverImage,
  uploadProductImages,
  resizeProductImages,
};
