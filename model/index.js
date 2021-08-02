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


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
};

