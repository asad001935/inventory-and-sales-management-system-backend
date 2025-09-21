const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const port = process.env.PORT || 5000;
dotenv.config();
const app = express();
const path = require("path");
// app.use(
//   cors({
//     // origin: [
//     //   "http://localhost:5173",
//     //   "https://inventory-and-sales-management-system-backend-production.up.railway.app",
//     // ],
//     origin: "*",
//     credentials: true,
//   })
// );
app.use(cors({
  origin: '*', 
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const supplierRoutes = require("./routes/supplierRoutes");
app.use("/api/suppliers", supplierRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const formRoutes = require("./routes/formRoutes");
app.use("/api/contact", formRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

app.get("/test-error", (req, res) => {
  res.status(400).json({ success: false, error: "Test error message" });
});

const multerFile = require("./images/multerFile");
app.use("/api/images", multerFile);

const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
