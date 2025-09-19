import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.json({ success: false, error: "Cart not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Remove from Cart Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
