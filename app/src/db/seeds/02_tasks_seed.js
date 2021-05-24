exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('tasks')
    .del()
    .then(function () {
      return knex('tasks').insert([
        { id: 1, name: 'Task 1', summary: 'Task 1 summary', creator_id: 2 },
        { id: 2, name: 'Task 2', summary: 'Task 2 summary', creator_id: 2 },
        { id: 3, name: 'Task 3', summary: 'Task 3 summary', creator_id: 3 },
      ]);
    });
};
