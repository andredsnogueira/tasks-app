const config = require('./../knexfile');

exports.knex = require('knex')(
  process.env.NODE_ENV === 'test' ? config.test : config.development
);
