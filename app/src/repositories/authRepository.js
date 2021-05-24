const { knex } = require('../db');

exports.login = (req) => {
  return knex
    .select('id', 'email', 'password', 'manager')
    .from('users')
    .where('email', req.body.email)
    .first();
};
