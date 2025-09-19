const Supplier = require("../models/Supplier");
const ApiError = require("../utils/ApiError");

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

module.exports = {
  async createSupplier({name, companyName, contact, email, address, createdBy }) {
    try {
      const existingSupplier = await Supplier.findOne({
        $or: [{ name }, { contact }, { email }],
      });

      if (existingSupplier) {
        throw new ApiError(
          existingSupplier.name === name
            ? "Supplier with this name already exists"
            : existingSupplier.contact === contact
            ? "Supplier with this contact already exists"
            : "Supplier with this email already exists",
          400
        );
      }

      if (!isValidEmail(email.toLowerCase())) {
        throw new ApiError("Email format is not correct. Try another one.", 400);
      }

      const newSupplier = new Supplier({
        name,
        companyName,
        contact,
        email,
        address,
        createdBy,
      });

      return await newSupplier.save();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Some error while creating supplier: ${error.message}`, 500);
    }
  },

  async deleteSupplier(supplierId) {
    try {
      const supplier = await Supplier.findByIdAndDelete(supplierId);
      if (!supplier) {
        throw new ApiError("Supplier not found", 404);
      }
      return supplier;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Some error while deleting supplier: ${error.message}`, 500);
    }
  },

  async editSupplier(supplierId, req) {
    try {
      const { name, companyName, contact, email, address } = req.body;
      const supplier = await Supplier.findById(supplierId);
      if (!supplier) {
        throw new ApiError("Supplier not found", 404);
      }

      const updatedSupplier = await Supplier.findByIdAndUpdate(
        supplierId,
        req.body,
        { new: true }
      );
      return updatedSupplier;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(`Some error while editing supplier: ${error.message}`, 500);
    }
  },

  async getAllSuppliers() {
    try {
      return await Supplier.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "username email role");
    } catch (error) {
      throw new ApiError(`Some error while fetching suppliers: ${error.message}`, 500);
    }
  },

  async getSupplierByUserId(userId) {
    try {
      return await Supplier.find({ createdBy: userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw new ApiError(`Some error while fetching suppliers by userId: ${error.message}`, 500);
    }
  },
};
