
exports.up = function(knex, Promise) {
  return Promise.all([
        knex.schema.table('users', function(table){
          table.renameColumn('name', 'first_name');
          table.string('last_name', 50);
          table.string('email', 50);
          table.string('handle', 50);
          table.string('password', 250);
        }),

        knex.schema.createTable('resources', function(table){
          table.increments();
          table.string('url', 250);
          table.string('title', 50);
          table.text('description');
          table.bigInteger('created_by').references('users.id');
        }),

        knex.schema.createTable('category', function(table){
          table.increments();
          table.string('cat_name', 50);
          table.bigInteger('user_id');
        }),

        knex.schema.createTable('likes', function(table){
          table.increments();
          table.bigInteger('user_id');
          table.bigInteger('resource_id');
        }),

        knex.schema.createTable('ratings', function(table){
          table.bigInteger('user_id');
          table.bigInteger('resource_id');
          table.integer('rating');
        }),

        knex.schema.createTable('comments', function(table){
          table.bigInteger('user_id');
          table.bigInteger('resource_id');
          table.text('comment');
        })
    ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function(table){
      table.renameColumn('first_name', 'name');
      table.dropColumns('last_name', 'email', 'handle', 'password');
    }),
    knex.schema.dropTable('resources'),
    knex.schema.dropTable('category'),
    knex.schema.dropTable('likes'),
    knex.schema.dropTable('ratings'),
    knex.schema.dropTable('comments')
  ])
};
