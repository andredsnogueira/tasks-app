require('dotenv').config();
const express = require('express');
const app = express();
const { router } = require('./routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log('Server is up and running.');
  });
}

module.exports = app;
