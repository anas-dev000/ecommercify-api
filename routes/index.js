//routes
const categoryRouter = require("./categoryRoutes");
const subCategoryRouter = require("./subCategoryRoutes");
const brandRouter = require("./brandRoutes");
const productRouter = require("./productRoutes");
const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const reviewRouter = require("./reviewRoutes");
const meRouter = require("./meRoutes");
const cartRouter = require("./cartRoutes");
const couponRouter = require("./couponRoutes");
const orderRouter = require("./orderRoutes");

const allRoutes = (app) => {
  app.use("/api/categories", categoryRouter);
  app.use("/api/subCategories", subCategoryRouter);
  app.use("/api/brands", brandRouter);
  app.use("/api/products", productRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/users/me", meRouter);
  app.use("/api/users", userRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/orders", orderRouter);
};

module.exports = allRoutes;
