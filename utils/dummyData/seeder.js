const fs = require("fs");
const dotenv = require("dotenv");
const Product = require("../../models/productModel");
const dbConnection = require("../../config/dbConnection");

dotenv.config({ path: "../../.env" });

dbConnection();

const products = JSON.parse(fs.readFileSync("product.json", "utf-8"));
const slugify = require("slugify");

const productsWithSlug = products.map((product) => {
  product.slug = slugify(product.name, { lower: true });
  return product;
});

const importProducts = async () => {
  try {
    await Product.create(productsWithSlug);
    console.log("Products imported successfully!");
    process.exit();
  } catch (err) {
    console.error("Error importing products:", err);
    process.exit(1);
  }
};

const deleteProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products deleted successfully!");
    process.exit();
  } catch (err) {
    console.error("Error importing products:", err);
    process.exit(1);
  }
};

if (process.argv[2] === "--import" || process.argv[2] === "-i") {
  importProducts();
} else if (process.argv[2] === "--delete" || process.argv[2] === "-d") {
  deleteProducts();
}
