const User = require("../models/User");
const userServices = require("../services/userServices");
const ApiError = require("../utils/ApiError");

const getStaffUsers = async (req, res, next) => {
  try {
    const users = await userServices.getOrdersByStaff();
    return res
      .status(200)
      .json({ message: "Staff fetched successfully.", users });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userServices.fetchAllUsers();
    return res
      .status(200)
      .json({ message: "All users fetched successfully.", users });
  } catch (error) {
    next(error);
  }
};

const getAllStaff = async (req, res) => {
  try {
    const staffUsers = await User.find({ role: "Staff" }).select(
      "username email role"
    );
    res
      .status(200)
      .json({ message: "Staff fetched successfully.", users: staffUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching staff.", error: error.message });
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const updateRole = await userServices.updateUserRole(id, role);
    res
      .status(200)
      .json({ message: "Status updated successfully.", user: updateRole });
  } catch (error) {
    next(error);
  }
};

const getUserById = async(req,res,next)=>{
  try {
    const {id} = req.params;
    const user = await userServices.getUserById(id);
    res
      .status(200)
      .json({ message: "User fetched successfully.", user });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStaffUsers, getAllStaff, getAllUsers, updateUserRole, getUserById };
