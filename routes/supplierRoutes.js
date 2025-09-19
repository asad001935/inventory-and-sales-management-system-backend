const supplierController = require("../controllers/supplierController");
const express = require("express");
const { authenticate, roleCheck } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/createSupplier', authenticate, roleCheck("Admin", "Manager"), supplierController.createSupplier);
router.get('/all-suppliers', authenticate, supplierController.getAllSuppliers);
router.get('/supplierByUserId', authenticate, supplierController.getSupplierByUserId);
router.delete('/:id', authenticate, roleCheck("Admin"), supplierController.deleteSupplier);
router.put('/:id', authenticate, roleCheck("Admin"), supplierController.editSupplier);

module.exports = router;