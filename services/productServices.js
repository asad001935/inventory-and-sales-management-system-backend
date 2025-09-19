const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

module.exports = {
  async createProduct(req) {
    try {
      const { name, description, price, quantity, supplierId } = req.body;
      const existingProduct = await Product.findOne({ name, price });
      if (existingProduct) {
        throw new ApiError("Product with the same name and price already exists.");
      }
      const newProduct = new Product({
        name,
        description,
        price,
        quantity,
        supplierId,
        createdBy: req.user.id,
      });
      const createdProduct = await newProduct.save();
      return createdProduct;
    } catch (error) {
      throw new ApiError(`Error creating product: ${error.message}`);
    }
  },

  async getAllProducts() {
    try {
      const products = await Product.find()
        .populate("supplierId", "name companyName")
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 });
      return products;
    } catch (error) {
      throw new ApiError(`Error fetching products: ${error.message}`);
    }
  },

  async updateProduct(req) {
    try {
      const { id } = req.params;
      const { name, description, price, quantity } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, quantity },
        { new: true }
      );
      return updatedProduct;
    } catch (error) {
      throw new ApiError(`Error updating product: ${error.message}`);
    }
  },

  async deleteProduct(productId){
    try {
        const product = await Product.findByIdAndDelete(productId);
        if(!product){
            throw new ApiError("Product not found");
        };
        return product;
    } catch (error) {
      throw new ApiError(`Error deleting product: ${error.message}`);
    }
  },

  async getProductBySupplierId(supplierId){
    try {
        const products = await Product.find({supplierId: supplierId}).sort({ createdAt: -1 });
        return products;
    } catch (error) {
      throw new ApiError(`Error fetching products by supplier: ${error.message}`);
    }
  }
};
