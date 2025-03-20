const mongoose = require("mongoose");
const setImageUrl = require("../utils/setImageUrl");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "brand name is required"],
      unique: [true, "brand name must be unique"],
      minlength: [2, "brand name must be at least 2 characters long"],
      maxlength: [30, "brand name must not exceed 30 characters"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    image: String,
  },
  { timestamps: true }
);

//After find and update brand
brandSchema.post("init", (document) => {
  setImageUrl(document, "image", "brands");
});

//After creating a new brand
brandSchema.post("save", (document) => {
  setImageUrl(document, "image", "brands");
});

module.exports = mongoose.model("brand", brandSchema);
