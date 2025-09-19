const productController = require("../controllers/productController");
const express = require("express");
const router = express.Router();
const { authenticate, roleCheck } = require('../middlewares/authMiddleware');

router.post("/", authenticate, roleCheck("Admin", "Manager"), productController.createProduct);
router.get("/", productController.getAllProducts);
router.put("/:id", authenticate, roleCheck("Admin", "Manager"), productController.updateProducts);
router.delete("/:id", authenticate, roleCheck("Admin"), productController.deleteProduct);
router.get("/supplier/:supplierId", authenticate, productController.getProductBySupplierId);


module.exports = router;
