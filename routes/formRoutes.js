const express = require("express");
const router = express.Router();
const contactFormController = require("../controllers/contactFormController");
const { authenticate, roleCheck } = require("../middlewares/authMiddleware");

router.post("/createForm", contactFormController.createForm);
router.get(
  "/",
  authenticate,
  roleCheck("Admin", "Manager"),
  contactFormController.allForms
);

router.put('/:id/read', contactFormController.forStatus);
router.get('/unread-count', contactFormController.forUnreadMails);

module.exports = router;
