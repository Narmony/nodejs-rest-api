const Joi = require('joi');

const contactScheme = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(2).required(),
});

const updateContacts = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().min(2),
});

module.exports = {
  contactScheme,
  updateContacts,
};
