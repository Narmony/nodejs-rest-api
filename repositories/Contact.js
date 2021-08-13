const { Contact } = require('../models');

const listContacts = async (userId, query) => {
  // return await Contact.find({owner: userId}).populate({
  //   path: 'owner',
  //   select: 'name email subscription'
  // });
  const { sortBy, sortByDesc, filter, favorite=null, name=null,  limit = 20, page = 1 } = query;
  const optionSearch = { owner: userId };

  if(favorite !== null){
    optionSearch.favorite = favorite
  }

  return await Contact.paginate(optionSearch, {
    limit,
    page,
    sort:{
      ...(sortBy ? {[`${sortBy}`]:1}:{}),
      ...(sortByDesc ? {[`${sortByDesc}`]:-1}:{})
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: { path: 'owner', select: 'name email subscription' },
    });
};

const getContactById = async (userId, contactId) => {
  try {
    const result = await Contact.findById({_id: contactId, owner: userId}).populate({
      path: 'owner',
      select: 'name email subscription'
    });
    return result;
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const removeContact = async (userId, contactId) => {
  try {
    const result = await Contact.findOneAndRemove({_id: contactId, owner: userId});
    return result;
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return null;
    }
    throw error;
  }
};

const addContact = async (userId, body) => {
  return Contact.create({owner: userId, ...body});
};

const updateContact = async (userId, contactId, body) => {
  return await Contact.findByIdAndUpdate({_id:contactId, owner: userId},  {...body});
};

const updateStatus = async (userId, contactId, body ) => {
  try {
    return await Contact.findByIdAndUpdate({_id: contactId, owner: userId}, {...body}, { new: true });
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

