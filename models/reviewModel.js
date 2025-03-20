const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = mongoose.Schema(
  {
    title: String,

    ratings: {
      type: Number,
      required: [true, "review must be required between 1 and 5"],
      min: [1.0, "Rating must be between 1 and 5"],
      max: [5.0, "Rating must be between 1 and 5"],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be belong to user"],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must be belong to product"],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

//ٍstatics means that we add a method at the level of the model itself, not at the level of individual documents.
reviewSchema.statics.averageRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    // 1) Specify ratings for a specific product.
    // Filter all reviews so we can only work on product reviews.
    { $match: { product: productId } },
    // 2) Group by product and calculate average rating.

    // $group: groups reviews by product (_id: 'product').
    // $avg: '$ratings' calculates the average of the ratings.
    // $sum: 1 calculates the number of ratings.

    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        sumRatingsQuantity: { $sum: 1 },
      },
    },
  ]);

  // 3) Return the average rating and the total number of ratings.
  await Product.updateOne(
    { _id: productId },
    {
      ratingsAverage: result.length > 0 ? result[0].avgRatings : 0,
      ratingsQuantity: result.length > 0 ? result[0].sumRatingsQuantity : 0,
    }
  );
};

reviewSchema.post("save", async function () {
  await this.constructor.averageRatingAndQuantity(this.product);
});

reviewSchema.post("remove", async function () {
  await this.constructor.averageRatingAndQuantity(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
