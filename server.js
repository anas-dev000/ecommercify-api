const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const hpp = require("hpp");
const compression = require("compression");
const path = require("path");
const swaggerDocs = require("./swagger");

const { webhookCheckout } = require("./controllers/orderController");

require("dotenv").config();

//database configuration
const dbConnect = require("./config/dbConnection");

//routes
const allRoutes = require("./routes");

//Error handlers
const apiError = require("./utils/apiError");
const globalError = require("./middlewares/globalError");

const app = express();
app.set("trust proxy", 1);
swaggerDocs(app);

// Connect to MongoDB
dbConnect();

// Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// compress all responses
app.use(compression());

// Receive response from Stripe after successful payment.
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

// Middleware for logging
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log("Development mode");
}

app.get("/", (req, res) => {
  res.send("Welcome to Express E-commerce API!");
});

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour",
});

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);

// All Routes middleware
allRoutes(app);

app.all("*", (req, res, next) => {
  next(new apiError(`can't find the route : ${req.originalUrl}`, 400));
});

//Global error handler middleware inside express
app.use(globalError);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handel rejections outside express shut down server
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection Errors ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server is closing...");
    process.exit(1);
  });
});
