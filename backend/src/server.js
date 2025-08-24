const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/amazon-clone", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ==========================
// Product Schema + Model
// ==========================
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});
const Product = mongoose.model("Product", productSchema);

// ==========================
// Cart Schema + Model
// ==========================
const cartSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});
const Cart = mongoose.model("Cart", cartSchema);

// ==========================
// Product Routes
// ==========================

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// Cart Routes
// ==========================

// Get all cart items
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to cart
app.post("/cart", async (req, res) => {
  try {
    const cartItem = new Cart(req.body);
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete from cart
app.delete("/cart/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Cart item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================
// Start Server
// ==========================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
