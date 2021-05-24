const { knex } = require('../db');

exports.all = (req) => {
  const tasks = knex('tasks').select([
    'name',
    'summary',
    'completed_at',
    'created_at',
    'creator_id',
  ]);

  if (!req.user.manager) {
    tasks.where('creator_id', req.user.id);
  }

  return tasks;
};

exports.save = (req) => {
  return knex('tasks').insert({
    name: req.body.name,
    summary: req.body.summary,
    creator_id: req.user.id,
  });
};

exports.update = (req) => {
  return knex('tasks')
    .where((query) => {
      query.where('creator_id', req.user.id).where('id', req.params.id);
    })
    .update({
      name: req.body.name,
      summary: req.body.summary,
    });
};

exports.delete = (req) => {
  return knex('tasks').where('id', req.params.id).delete();
};

exports.complete = (req) => {
  return knex('tasks')
    .where((query) => {
      query.where('creator_id', req.user.id).where('id', req.params.id);
    })
    .first()
    .update({ completed_at: knex.fn.now() });
};

exports.getByUserAndId = (req) => {
  return knex('tasks')
    .where((query) => {
      query.where('creator_id', req.user.id).where('id', req.params.id);
    })
    .select(['id', 'name', 'summary', 'creator_id', 'completed_at'])
    .first();
};
