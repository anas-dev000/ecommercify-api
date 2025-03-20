const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Subcategory name is required"],
      unique: [true, "Subcategory name must be unique"],
      minlength: [2, "Subcategory name must be at least 2 characters long"],
      maxlength: [30, "Subcategory name must not exceed 30 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must be belong to parent category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name _id",
  });
  next();
});

module.exports = mongoose.model("Subcategory", subCategorySchema);
