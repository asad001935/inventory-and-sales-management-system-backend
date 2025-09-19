const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    },
    role:{
        type: String,
        enum: ["Admin", "Manager", "Staff", "admin", "manager", "staff", "User", "user"],
        default: "User",
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("User", userSchema);