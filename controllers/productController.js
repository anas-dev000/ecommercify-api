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

// @DESC Create a new product
// @route Post /api/products
// @access Private

const createProduct = handlersController.createOne(Product);

// @DESC Get all products
// @route Get /api/products
// @access Public

const getAllProducts = handlersController.getAll(Product);

// @DESC Get specific product
// @route Get /api/products/:id
// @access Private

const getProductById = handlersController.getOne(Product);

// @DESC Update specific product
// @route Put /api/products/:id
// @access Private

const updateProduct = handlersController.updateOne(Product);

// @DESC Delete specific product
// @route Delete /api/products/:id
// @access Private

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
