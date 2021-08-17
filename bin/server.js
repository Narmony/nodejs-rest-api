const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

const createFolderIfNotExist = require('../helpers/create-folder');

const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
const path = require('path')
// const storeImage = path.join(process.cwd(), 'public/avatars')
mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, async () => {
      await createFolderIfNotExist(UPLOAD_DIR);
      // await createFolderIfNotExist(path.join(process.cwd(), 'public'));
      // await createFolderIfNotExist(path.join(process.cwd(), 'public/avatars'));
      // await createFolderIfNotExist(storeImage);

      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch(error => console.log(error));
