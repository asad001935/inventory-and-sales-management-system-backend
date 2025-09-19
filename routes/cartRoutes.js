const express = require("express");
const { addToCart, getCart, removeFromCart, updateCartQuantity } = require("../controllers/cartController.js");
const { authenticate, roleCheck } = require("../middlewares/authMiddleware.js");
const router = express.Router();

router.post("/add", authenticate, addToCart);
router.get("/", authenticate, getCart);
router.delete("/:id", authenticate, removeFromCart);

module.exports = router;
