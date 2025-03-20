const mongoose = require("mongoose");
const setImageUrl = require("../utils/setImageUrl");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Product name must be at least 3 characters long"],
      maxlength: [100, "Product name must not exceed 100 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [
        20,
        "Product description must be at least 20 characters long",
      ],
      maxlength: [500, "Product description must not exceed 500 characters"],
    },

    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [1, "Product quantity must be at least 1"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [1, "Product price must be at least 1"],
      max: [100000, "Product price must not exceed 100,000"],
    },

    priceAfterDiscount: {
      type: Number,
    },

    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },

    images: [String],

    colors: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },

    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
        required: [true, "Product must belong to a subcategory"],
      },
    ],

    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },

    ratingAverage: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

//After find and update product
productSchema.post("init", (document) => {
  setImageUrl(document, "imageCover", "products");
  setImageUrl(document, "images", "products");
});

//After creating a new product
productSchema.post("save", (document) => {
  setImageUrl(document, "imageCover", "products");
  setImageUrl(document, "images", "products");
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name _id",
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
