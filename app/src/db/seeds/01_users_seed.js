exports.seed = function (knex) {
  const password =
    '$2b$10$hmXa4egpBS/GbUtLlWH5TOQmfvCdD3/5yyDY1fCQv7O6wSf..4KbO'; // password
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function () {
      return knex('users').insert([
        {
          id: 1,
          name: 'Manager',
          email: 'manager@example.com',
          password: password,
          manager: true,
        },
        {
          id: 2,
          name: 'Technician 1',
          email: 'technician1@example.com',
          password: password,
        },
        {
          id: 3,
          name: 'Technician 2',
          email: 'technician2@example.com',
          password: password,
        },
      ]);
    });
};
