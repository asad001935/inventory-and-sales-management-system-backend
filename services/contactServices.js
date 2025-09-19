const contact = require("../models/contact");
const ApiError = require("../utils/ApiError");
const { sendMail } = require("../controllers/mailer");

module.exports = {
  async createContact(req) {
    try {
      const { name, email, message } = req.body;
      const newContact = new contact({
        name,
        email,
        message,
      });
      const savedContactForm = await newContact.save();
      await sendMail(
        process.env.ADMIN_EMAIL,
        `New Contact Form Submission from ${name}`,
        `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
      );
      await sendMail(
        email,
        "We received your message",
        `Hi ${name},\n\nThanks for contacting us! We'll get back to you soon.`
      );

      return savedContactForm;
    } catch (error) {
      throw new ApiError(`Error in form creation: `, error.message);
    }
  },

  async fetchAllContactForms() {
    try {
      const contactForms = await contact.find();
      return contactForms;
    } catch (error) {
      throw new ApiError(`Error in contact form creation: `, error.message);
    }
  },

  async forStatus(id) {
    try {
      const updatingContact = await contact.findByIdAndUpdate(
        id,
        { read: true },
        { new: true }
      );
      await updatingContact.save();
      return updatingContact;
    } catch (error) {
      throw new ApiError(`Some error: `, error.message);
    }
  },

  async forUnreadMessages() {
    try {
      const unreadMails = await contact.countDocuments({ read: false });
      return unreadMails;
    } catch (error) {
      throw new ApiError(`Some error: `, error.message);
    }
  },
};
