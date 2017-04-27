exports.seed = function(knex, Promise) {
  return knex('resources').del()
    .then(() => { return knex('users').del() })
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, first_name: 'Alice'}),
        knex('users').insert({id: 2, first_name: 'Bob'}),
        knex('users').insert({id: 3, first_name: 'Charlie'})
      ]);
    });
};
