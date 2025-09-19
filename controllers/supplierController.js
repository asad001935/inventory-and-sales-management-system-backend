const supplierServices = require("../services/supplierServices");

const createSupplier = async (req, res, next) => {
  try {
    console.log("Data passed to service:", {
      ...req.body,
      createdBy: req.user?.id,
    });
    console.log("req.user in controller:", req.user);


    const supplier = await supplierServices.createSupplier({
      ...req.body,
      createdBy: req.user ? req.user.id : null,
    });
    return res.status(201).json(supplier);
  } catch (err) {
    next(err)
  }
};

const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierServices.getAllSuppliers();
    return res
      .status(200)
      .json({ message: "All suppliers fetched successfully.", suppliers });
  } catch (err) {
    next(err);
  }
};

const getSupplierByUserId = async (req, res, next) => {
  try {
    const user = req.user;
    const userId = user.id;
    const suppliers = await supplierServices.getSupplierByUserId(userId);
    return res
      .status(200)
      .json({ message: "Suppliers fetched successfully.", suppliers });
  } catch (err) {
    // return res.status(400).json({ error: error.message });
    next(err)
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    const supplier = await supplierServices.deleteSupplier(supplierId);
    return res
      .status(200)
      .json({ message: "Supplier deleted successfully.", supplier });
  } catch (err) {
    next(err);
  }
};

const editSupplier = async (req, res, next) => {
  try {
    const supplierId = req.params.id;
    const updatedSupplier = await supplierServices.editSupplier(
      supplierId,
      req
    );
    return res
      .status(200)
      .json({ message: "Supplier updated successfully.", updatedSupplier });
  } catch (err) {
    // return res.status(400).json({ error: error.message });
    next(err)
  }
};

module.exports = {
  createSupplier,
  getAllSuppliers,
  getSupplierByUserId,
  deleteSupplier,
  editSupplier,
};
