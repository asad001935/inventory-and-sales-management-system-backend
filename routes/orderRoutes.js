const orderController = require("../controllers/orderController");
const express = require("express");
const router = express.Router();
const { authenticate, roleCheck } = require('../middlewares/authMiddleware');


router.post("/create", authenticate, roleCheck("user") , orderController.createOrder);
router.get("/users/:userId", authenticate, roleCheck("Admin"), orderController.getOrderByUserId);
router.put("/update/:orderId", authenticate, roleCheck("Admin"), orderController.updateOrderStatus);
router.get('/allOrders', authenticate, roleCheck("Admin", "Manager"), orderController.getAllOrders);
router.delete('/:id', authenticate, roleCheck("Admin"), orderController.deleteOrder);

router.put("/:orderId/assign", authenticate, roleCheck("Admin"), orderController.assignOrderToStaff);

router.get("/myOrders", authenticate, roleCheck("Staff"), orderController.getOrderForSingleStaff);

router.get("/staff-orders", authenticate, orderController.getOrderByStaff);

router.put('/:orderId/staff-request', authenticate, roleCheck("Staff"), authenticate,orderController.staffRequestStatus);
router.put("/:orderId/updateRequest", authenticate, roleCheck("Admin"), authenticate, orderController.approveStaffRequest)

module.exports = router;