const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB successfully");
  });
};

module.exports = dbConnect;
