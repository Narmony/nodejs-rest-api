const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const {
  listUsers,
  findUserById,
  findUserByEmail,
  addUser,
  updateToken,
  updateAvatar,
  findByVerifyToken,
  updateTokenVerify
} = require('../../repositories');
const { HttpCode } = require('../../helpers/constants');
const guard = require('./../../helpers/guard');
const upload = require('./../../helpers/upload');
const UploadAvatarService = require('../../services/local-upload');
const EmailService = require('../../services/email' )
const CreateSenderSendGrid = require('../../services/email-sender')

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

    const { id, name, email, subscription, avatarURL, verifyToken } =
      await addUser(req.body);

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid(),
      )
      await emailService.sendVerifyEmail(verifyToken, email, name)
    } catch (error) {
      console.log(error.message)
    }

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

    if (!user || !isValidPassword || !user.isVerified) {
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

router.get('/verify/:token', async(req, res, next)=>{
  try{
 const user = await findByVerifyToken(req.params.token)
 if(user){
   await updateTokenVerify(user.id, true, null)
  return res.json({
    status: 'success',
    code: 200,
    data: {message: 'Success!'},
  });
 }
 return res.status(HttpCode.BAD_REQUEST).json({
  status: 'error',
  code: HttpCode.BAD_REQUEST,
  message: 'Verification token is not valid',
});
  }catch(e){
next(e)
  }
})

router.post('/verify', async(req, res, next)=>{
  try{
    const user = await findUserByEmail(req.body.email);
    if(user){
      const { name, email, isVerified,verifyToken } = user
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid(),
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: 'success',
          code: 200,
          data: {message: 'Resubmitted  success!'},
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Verification has already been passed',
      });
    }
  
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'USER NOT FOUND',
    });

  }catch(e){next(e)}
})

module.exports = router;
