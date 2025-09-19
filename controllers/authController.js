const { generateToken } = require("../config/jwtProvides");
const User = require("../models/User");
const userServices = require("../services/userServices");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  try {
    const user = await userServices.createUser(req.body);
    return res
      .status(200)
      .json({ message: "User created successfully.", user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Wrong password. Try another one." });
    }
    const jwt = generateToken(user._id);
    return res
      .status(201)
      .json({ message: "You logged in successfully.", user, jwt });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = { register, login };
