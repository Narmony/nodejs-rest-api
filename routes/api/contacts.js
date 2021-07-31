const express = require('express');
const router = express.Router();
const Contacts = require('../../model');

const { updateContacts, contactScheme } = require('./validation');

router.get('/', async (req, res, next) => {
  try {
    const result = await Contacts.listContacts();
    res.json({ status: 'success', code: 200, data: { result } });
  } catch (e) {
    next(e);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      res.json({ status: 'success', code: 200, data: { contact } });
    }
    res.json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
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
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      res.json({ status: 'success', code: 200, data: { contact } });
    }
    res.json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (e) {
    next(e);
  }
});

router.patch('/:contactId', async (req, res, next) => {
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
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      res.json({ status: 'success', code: 200, data: { contact } });
    }
    res.json({ status: 'error', code: 404, message: 'Not Found' });
  } catch (e) {
    next(e);
  }
});

router.patch('/:contactId/favorite', async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  console.log(Object.keys(req.body));
  try {
    const result = await Contacts.updateStatus(contactId, body);
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'missing field favorite',
      });
    }
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

