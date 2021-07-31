<<<<<<< Updated upstream
// const fs = require('fs/promises')
// const contacts = require('./contacts.json')

const listContacts = async () => {}

const getContactById = async (contactId) => {}

const removeContact = async (contactId) => {}

const addContact = async (body) => {}

const updateContact = async (contactId, body) => {}
=======
const { Contact } = require('../models');

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async contactId => {
  try {
    const result = Contact.findById(contactId);
    return result;
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const removeContact = async contactId => {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const addContact = async body => {
  return Contact.create(body);
};

const updateContact = async (contactId, body) => {
  return Contact.findByIdAndUpdate(contactId, body);
};

const updateStatus = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, body, { new: true });
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed for value')) {
      return null;
    }
    throw error;
  }
};
>>>>>>> Stashed changes

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
<<<<<<< Updated upstream
}
=======
  updateStatus,
};
>>>>>>> Stashed changes
