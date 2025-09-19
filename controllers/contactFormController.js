const contactServices = require("../services/contactServices");

const createForm = async (req, res, next) => {
  try {
    const form = await contactServices.createContact(req);
    return res
      .status(200)
      .json({ message: "Contact form created successfully.", form });
  } catch (error) {
    next(error);
  }
};

const allForms = async (req, res, next) => {
  try {
    const {id} = req.params;
    const forms = await contactServices.fetchAllContactForms(id);
    return res
      .status(200)
      .json({ message: "Forms fetched successfully", forms });
  } catch (error) {
    next(error);
  }
};

const forStatus = async (req, res, next) => {
  try {
    const {id} = req.params;
    const message = await contactServices.forStatus(id);
    return res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

const forUnreadMails = async(req,res,next)=>{
  try {
    const messages = await contactServices.forUnreadMessages();
    return res.status(200).json(messages);
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createForm,
  allForms,
  forStatus,
  forUnreadMails
};
