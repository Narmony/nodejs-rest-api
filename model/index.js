const fs = require('fs/promises');
const path = require('path');
const { v4: uuid } = require('uuid');

const readData = async () => {
  const data = await fs.readFile(
    path.join(__dirname, 'contacts.json'),
    'utf-8',
  );
  return JSON.parse(data);
};

const listContacts = async (req, res) => {
  return await readData();
};

const getContactById = async contactId => {
  const data = await readData();
  const [result] = data.filter(contact => contact.id === contactId);
  return result;
};

const removeContact = async contactId => {
  const data = await readData();
  const result = data.findIndex(e => {
    return e.id === contactId;
  });
  if (result === -1) {
    return null;
  }
  const delitedContact = data.splice(result, 1);
  await fs.writeFile(
    path.join(__dirname, 'contacts.json'),
    JSON.stringify(data),
  );
  return delitedContact;
};

const addContact = async body => {
  const id = uuid();
  const record = {
    id,
    ...body,
  };
  const data = await readData();
  data.push(record);
  await fs.writeFile(
    path.join(__dirname, 'contacts.json'),
    JSON.stringify(data),
  );
  return record;
};

const updateContact = async (contactId, body) => {
  const data = await readData();

  const [result] = data.filter(contact => contact.id === contactId);
  if (result) {
    Object.assign(result, body);
    await fs.writeFile(
      path.join(__dirname, 'contacts.json'),
      JSON.stringify(data),
    );
  }
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
