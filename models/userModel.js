const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const setImageUrl = require("../utils/setImageUrl");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required !"],
      minlength: [3, "name must be at least 3 characters long !"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email is required!"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    profileImage: String,
    phone: String,

    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        street: String,
        city: String,
        postCode: String,
      },
    ],

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "password is required!"],
      minlength: [8, "password must be at least 8 characters long!"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetVerified: Boolean,
    passwordResetExpires: Date,
    resetToken: String,
  },
  { timestamps: true }
);

//After find and update user
userSchema.post("init", (document) => {
  setImageUrl(document, "profileImage", "users");
});

//After creating a new user
userSchema.post("save", (document) => {
  setImageUrl(document, "profileImage", "users");
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//password validation
userSchema.methods.matchPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
