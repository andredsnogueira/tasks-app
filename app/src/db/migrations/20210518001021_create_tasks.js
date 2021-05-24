exports.up = function (knex) {
  return knex.schema.createTable('tasks', function (table) {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.string('summary', 2000).notNullable();
    table
      .integer('creator_id')
      .unsigned()
      .index()
      .references('id')
      .inTable('users');
    table.timestamp('completed_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tasks');
};