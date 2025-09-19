const productServices = require("../services/productServices");

const createProduct = async(req,res)=>{
    try {
        console.log("Request Body:", req.body); 
        const product = await productServices.createProduct(req);
        res.status(200).json({message: "Product created successfully", product})
    } catch (error) {
        res.status(500).json({error: `Error while creating product: ${error.message}`})
    }
};

const getAllProducts = async(req,res)=>{
    try {
        const products = await productServices.getAllProducts();
        res.status(200).json({message:"Products fetched successfully.",products})
    } catch (error) {
        res.status(500).json({error: `Error while fetching products: ${error.message}`})
    }
}

const updateProducts = async(req,res)=>{
    try {
        const updatedProduct = await productServices.updateProduct(req);
        res.status(200).json({message: "Product updated successfully", updatedProduct})
    } catch (error) {
        res.status(500).json({error: `Error while updating product: ${error.message}`})
    }
}

const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        await productServices.deleteProduct(id);
        res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).json({error: `Error while deleting product: ${error.message}`});
    }
}

const getProductBySupplierId = async(req,res)=>{
    try {
        const {supplierId} = req.params;
        const products = await productServices.getProductBySupplierId(supplierId);
        res.status(200).json({message: "Products fetched successfully", products});
    } catch (error) {
        res.status(500).json({error: `Error while fetching products by supplier ID: ${error.message}`});
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    updateProducts,
    deleteProduct,
    getProductBySupplierId
};