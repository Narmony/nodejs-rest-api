const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
<<<<<<< Updated upstream
  res.json({ message: 'template message' })
})
=======
  try {
    const result = await Contacts.listContacts();
    res.json({ status: 'success', code: 200, data: { result } });
  } catch (e) {
    next(e);
  }
});
>>>>>>> Stashed changes

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

<<<<<<< Updated upstream
module.exports = router
=======
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
>>>>>>> Stashed changes
