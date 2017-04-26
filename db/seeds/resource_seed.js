
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('resource_seed').del()
    .then(function () {
      return Promise.all([
        knex.schema.createTable('users', function(table){
        table.increments();
        table.string('first_name', 50);
        table.string('last_name', 50);
        table.string('email', 50);
        table.string('handle', 50);
        table.string('password', 250);
        })

        knex.schema.createTable('resources', function(table){
        table.increments();
        table.string('url', 250);
        table.string('title', 50);
        table.text('description');
        table.foreign('created_by');
        })

        knex.schema.createTable('category', function(table){
        table.increments();
        table.string('cat_name', 50);
        table.bigInteger('user_id');
        })

        knex.schema.createTable('likes', function(table){
        table.increments();
        table.bigInteger('user_id');
        table.bigInteger('resource_id');
        })

        knex.schema.createTable('ratings', function(table){
        table.bigInteger('user_id');
        table.bigInteger('resource_id');
        table.integer('rating');
        })

        knex.schema.createTable('comments', function(table){
        table.bigInteger('user_id');
        table.bigInteger('resource_id');
        table.text('comment');
        })
      ]);
    });

};
