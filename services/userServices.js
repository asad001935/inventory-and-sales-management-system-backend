const User = require("../models/User");
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");
const Order = require("../models/Order");

module.exports = {
  async createUser({ username, email, password, role }) {
    try {
      // let {} = req.body;
      if (!username || !email || !password || !role) {
        throw new Error("All fields are required.");
      }
      const existingEmail = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (existingEmail) {
        throw new Error(
          existingEmail.email === email
            ? "Email already exists"
            : "Username already exists. Try another one."
        );
      }
      if (!isValidEmail(email)) {
        throw new Error("Email format is not correct. Try another one.");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw new Error(`Some error while creating user: ${error}`);
    }
  },

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError("User not found");
      }
      return user;
    } catch (error) {
      throw new ApiError(`Some error while fetching userById: ${error}`);
    }
  },

  async fetchAllUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new ApiError(`Some error while fetching users in backend`);
    }
  },

  async updateUserRole(userId, role){
    try {
      const user = await User.findById(userId);
      if(!user){
        throw new ApiError(`Cannot find user.`);
      };
      user.role = role;
      await user.save();
      return user
    } catch (error) {
      throw new ApiError(`Some error while updating the status of user: ${error.message}`);
    }
  },

  async getOrdersByStaff(staffId) {
    return await Order.find({ assignedStaffId: staffId })
      .populate("userId", "username email role")
      .populate("products.productId", "name price");
  },
};
