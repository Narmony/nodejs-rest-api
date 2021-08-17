const express = require('express');
const router = express.Router();
const {
  listUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateToken,
  updateAvatar,
} = require('../../repositories');
const jwt = require('jsonwebtoken');
const { HttpCode } = require('../../helpers/constants');
const guard = require('./../../helpers/guard');
const upload = require('./../../helpers/upload');
const UploadAvatarService = require('../../services/local-upload');
const fs = require('fs/promises');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const { userScheme } = require('./validation');

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

    const { id, name, email, subscription, avatarURL } = await addUser(
      req.body,
    );
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { id, name, email, subscription, avatarURL },
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

router.patch(
  '/avatars',
  guard,
  upload.single('avatar'),
  async (req, res, next) => {
    try {
      const id = req.user.id;

      const uploads = new UploadAvatarService(
        path.join(process.cwd(), 'public/avatars'),
      );
      const avatarUrl = await uploads.saveAvatar({
        idUser: id,
        file: req.file,
      });

      try {
        console.log('LOG:', req.user.avatarUrl);
        await fs.unlink(
          path.join(process.cwd(), 'public/avatars', req.user.avatarUrl),
        );
      } catch (e) {
        console.log(e.message);
      }

      await updateAvatar(id, avatarUrl);
      res.json({ status: 'success', code: 200, data: { avatarUrl } });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
