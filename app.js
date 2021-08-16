const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();
const path = require('path')
require('dotenv').config()

const contactsRouter = require('./routes/api/contacts');
// const { string } = require('joi');
const usersRouter = require('./routes/api/users');

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.use(logger(formatsLogger)); 
app.use(cors());
app.use(express.json({ limit: 10000 }));

app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ status: err.status === 500 ? 'fail' : 'error', code: err.status || 500, message: err.message });
});

module.exports = app;
