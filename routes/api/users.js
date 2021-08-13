const express = require('express');
const router = express.Router();
const {
  listUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateToken,
} = require('../../repositories');
const jwt = require('jsonwebtoken');
const { HttpCode } = require('../../helpers/constants');
const guard = require('./../../helpers/guard');

const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const {userScheme} =require('./validation');
// const validate = userScheme.validate(req.body)

router.post('/signup', async (req, res, next) => {
  
  try {

    const user = await findUserByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: ' email is already used',
      });
    }
    const { id, name, email, subscription } = await addUser(req.body);
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, name, email, subscription },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await findUserByEmail(req.body.email);
    console.log(user);

    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      });
    }
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await updateToken(id, token);

    return res.json({
      status: 'success',
      code: 200,
      data: {
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
});

router.post('/logout', guard, async (req, res, next) => {
  try {
    const id = req.user.id;
    await updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (err) {
    next(err);
  }
});
router.get('/current', guard, async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({
    status: 'success',
    code: 200,
    data: {
      email,
      subscription,
    },
  });
});

module.exports = router;
