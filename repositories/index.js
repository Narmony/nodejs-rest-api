const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
} = require('./Contact');
const {
  listUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateTokenVerify,
} = require('./User');

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
  listUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateTokenVerify
};
