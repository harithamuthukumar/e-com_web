import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/ecom")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ✅ Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  category: String,
  image: String, // store image URL
});
const Product = mongoose.model("Product", productSchema);

// ✅ Cart Schema
const cartSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});
const Cart = mongoose.model("Cart", cartSchema);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ------------------- PRODUCTS -------------------
// Get all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ------------------- CART -------------------
// Get cart items
app.get("/cart", async (req, res) => {
  const cart = await Cart.find();
  res.json(cart);
});

// Add to cart
app.post("/cart", async (req, res) => {
  try {
    const item = new Cart(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete from cart
app.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/cart", async (req, res) => {
  await Cart.deleteMany({});
  res.json({ message: "Order placed, cart cleared!" });
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
