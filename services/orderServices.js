const Order = require("../models/Order");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

module.exports = {
  async createOrder(req) {
    try {
      const { products, status } = req.body;
      const userId = req.user.id;
      for (const item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new ApiError(`Product with ID ${item.productId} not found.`);
        }
        if (item.quantity > product.quantity) {
          throw new ApiError(
            `Insufficient quantity for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
          );
        }
      }
      for (const item of products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity },
        });
      }
      let totalAmount = 0;
      for (const item of products) {
        const product = await Product.findById(item.productId);
        totalAmount += product.price * item.quantity;
      }
      const newOrder = new Order({
        userId,
        products,
        totalAmount,
        status,
      });
      const savedOrder = await newOrder.save();
      return savedOrder;
    } catch (error) {
      throw new ApiError(`Error creating order: ${error.message}`);
    }
  },

  async getOrderByUserId(userId) {
    try {
      const orders = await Order.find({ userId })
        .populate("products.productId")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ["pending", "shipped", "cancelled", "delivered"];
      if (!validStatuses.includes(status)) {
        throw new ApiError(
          `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`
        );
      }
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      ).populate("products.productId", "name price");
      return updatedOrder;
    } catch (error) {
      throw new ApiError(`Error updating order status: ${error.message}`);
    }
  },

  async getAllOrders() {
    try {
      const orders = await Order.find()
        .populate("userId", "username email role ")
        .populate("products.productId", "name price")
        .populate("assignedStaffId", "username, email, role")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new ApiError(`Error fetching all orders: ${error.message}`);
    }
  },

  async deleteOrder(orderId) {
    try {
      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        throw new ApiError("Cannot delete order. Try again");
      }
      return order;
    } catch (error) {
      throw new ApiError(`Error deleting order: ${error.message}`);
    }
  },

  async assignOrderToStaff(orderId, assignedStaffId) {
    try {
      const order = await Order.findById(orderId);
      if (!order) throw new ApiError("Order not found");

      if (order.assignedStaffId) {
        throw new ApiError("Staff already assigned to this order.");
      }

      order.assignedStaffId = assignedStaffId;
      await order.save();
      return await order.populate("assignedStaffId", "username email role");
    } catch (error) {
      throw new ApiError(`Some error while assigning to staff: ${error}`);
    }
  },

  async getOrderByStaff(staffId) {
    try {
      const orders = await Order.find({ assignedStaffId: staffId })
        .populate("userId", "username email")
        .populate("products.productId", "name, price")
        .populate("assignedStaffId", "username email role")
        .sort({ createdAt: -1 });
      return orders;
    } catch (error) {
      throw new ApiError(`Error while fetching staff orders: ${error.message}`);
    }
  },

  async orderRequestUpdationByStaff(orderId, request) {
    try {
      // const order = await Order.findOne({
      //   _id: orderId,
      //   assignedStaffId: req.user._id,
      // });
      const order = await Order.findById(orderId);
      if (!order) {
        throw new ApiError(`Request not sent. Try again later`);
      }
      order.staffRequest = request;
      await order.save();
      return order;
    } catch (error) {
      throw new ApiError(`Error in sending request: ${error.message}`);
    }
  },

  async approveStaffRequest(orderId, status) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new ApiError(`Order not found!`);
      }
      order.status = status;
      order.staffRequest = "";
      await order.save();
      return order;
    } catch (error) {
      throw new ApiError(
        `Some error in accepting staff request: ${error.message}`
      );
    }
  },
};
