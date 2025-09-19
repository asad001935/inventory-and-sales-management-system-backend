const authController = require('../controllers/authController');
const express = require("express");
const { authenticate, roleCheck } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', authController.register );
router.post('/login', authController.login);

module.exports = router;
