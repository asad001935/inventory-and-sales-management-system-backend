require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (userId) => {
  const token = jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: "1d" });
  return token;
};

const getUserIdByToken = (token) => {
  const decodedToken = jwt.verify(token, JWT_SECRET);
  return decodedToken.userId;
};

const authorizeRole = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return res.status(403).json({error: "Access denied. You do not have permission to perform this action."});
    }
    next();
  }
}

module.exports = { generateToken, getUserIdByToken, authorizeRole };
