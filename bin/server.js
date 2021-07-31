const app = require('../app');
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT);
  })
  .catch(error => console.log(error));
