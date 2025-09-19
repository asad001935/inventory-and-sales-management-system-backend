const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true,
    },
    companyName:{
        type: String,
    },
    contact:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    address:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Supplier", supplierSchema);