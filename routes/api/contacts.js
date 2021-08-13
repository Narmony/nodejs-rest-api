const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatus,
} = require('../../repositories');

const { updateContacts, contactScheme } = require('./validation');
const guard = require('../../helpers/guard');

router.get('/', guard, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {docs: contacts, ...rest} = await listContacts(userId, req.query);
    res.json({ status: 'success', code: 200, data: { contacts, ...rest } });
  } catch (e) {
    next(e);
  }
});

router.get('/:contactId', guard, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await getContactById(userId, req.params.contactId);
    if (contact) {
      return res.json({ status: 'success', code: 200, data: { contact } });
    }
    res.json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (e) {
    next(e);
  }
});

router.post('/', guard, async (req, res, next) => {
  console.log(contactScheme.validate(req.body));
  const { error } = contactScheme.validate(req.body);

  try {
    if (error) {
      return res.json({
        status: 'error',
        code: 400,
        message: 'Invalid data' + error.message,
      });
    }
    const userId = req.user.id;

    const contact = await addContact(userId, req.body);
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
});

router.delete('/:contactId', guard, async (req, res, next) => {
  try {
    const userId = req.user.id;

    const contact = await removeContact(userId, req.params.contactId);
    if (contact) {
      res.json({ status: 'success', code: 200, data: { contact } });
    }
    res.json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (e) {
    next(e);
  }
});

router.patch('/:contactId', guard, async (req, res, next) => {
  try {
    const { error } = updateContacts.validate(req.body);
    if (error) {
      console.log(updateContacts.validate(req.body));
      return res.json({
        status: 'error',
        code: 400,
        message: 'Invalid data' + error.message,
      });
    }
    const userId = req.user.id;

    const contact = await updateContact(userId, req.params.contactId, req.body);
    if (contact) {
      res.json({ status: 'success', code: 200, data: { contact } });
    }
    res.json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (e) {
    next(e);
  }
});

router.patch('/:contactId/favorite', guard, async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  console.log(Object.keys);
  try {
    const isBodyEmpty = Object.keys(req.body).length === 0;
    if (isBodyEmpty) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing field favorite',
      });
    }
    const userId = req.user.id;

    const result = await updateStatus(userId, contactId, body);
    if (!result) {
      res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      });
      return;
    }

    res.json({
      status: 'success',
      code: 200,
      data: { result },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
