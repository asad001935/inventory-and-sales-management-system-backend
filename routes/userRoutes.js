const userController = require("../controllers/userController");
const express = require("express");
const router = express.Router();
const { authenticate, roleCheck } = require('../middlewares/authMiddleware');

router.get('/all-users', authenticate, roleCheck("Admin", "Manager"), userController.getAllUsers);
router.get('/allStaff', authenticate, roleCheck("Admin", "Manager"), userController.getAllStaff);
router.put('/:id/role', userController.updateUserRole);
router.get("/:id", userController.getUserById);
module.exports = router;