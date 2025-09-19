const Order = require("../models/Order");
const orderServices = require("../services/orderServices");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    const totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      userId,
      products: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      status: "pending",
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderServices.getOrderByUserId(userId);
    res.status(200).json({
      message: `Orders for user ${userId} fetched successfully`,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderServices.updateOrderStatus(orderId, status);
    res
      .status(200)
      .json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const order = await orderServices.getAllOrders();
    console.log("Fetched orders: ", order);
    res
      .status(200)
      .json({ message: "Order fetched successfully", orders: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = orderServices.deleteOrder(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Error while deleting order: ${error.message}` });
  }
};

const assignOrderToStaff = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { assignedStaffId } = req.body;
    const orderAssigned = await orderServices.assignOrderToStaff(
      orderId,
      assignedStaffId
    );
    res
      .status(200)
      .send({ message: "Order assigned successfully.", order: orderAssigned });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error assigning order.", error: error.message });
  }
};

const getOrderForSingleStaff = async (req, res) => {
  try {
    const staffId = req.user._id;
    const orders = await Order.find({ assignedStaffId: staffId })
      .populate("userId", "username email")
      .populate("products.productId", "name price");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error fetching staff orders", error: error.message });
  }
};

const getOrderByStaff = async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const orders = await orderServices.getOrderByStaff(staffId);
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    next(error);
  }
};

const staffRequestStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { request } = req.body;
    const order = await orderServices.orderRequestUpdationByStaff(
      orderId,
      request
    );
    res.status(200).json({ message: "Order request sent successfully", order });
  } catch (error) {
    next(error);
  }
};

const approveStaffRequest = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderServices.approveStaffRequest(orderId, status);
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderByUserId,
  getOrderForSingleStaff,
  updateOrderStatus,
  getAllOrders,
  deleteOrder,
  assignOrderToStaff,
  getOrderByStaff,
  staffRequestStatus,
  approveStaffRequest,
};
