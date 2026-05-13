const express = require("express");
const cors = require("cors");

const categoryRoutes = require("./routes/category.routes");
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");
const productRoutes = require("./routes/product.routes");
const productImageRoutes = require("./routes/productImage.routes");
const discountRoutes = require("./routes/disscount.routes");
const salesInvoiceRoutes = require("./routes/selesInvoice.routes");
const paymentRoutes = require("./routes/payment.routes");
const app = express();
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());
const uploadPath = require("path").resolve("uploads");

console.log("Static serving folder:", uploadPath);

app.use("/uploads", express.static(uploadPath));
const statsRoutes = require("./routes/stats.routes");
// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/salesinvoices", salesInvoiceRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", productImageRoutes);
app.use("/api/stats", statsRoutes);
// Test
app.get("/", (req, res) => {
  res.send("Server is running...");
});

module.exports = app;
