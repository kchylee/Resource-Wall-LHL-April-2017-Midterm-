
exports.up = function(knex, Promise) {
  return knex.schema.createTable('cat_reso', function(table){
      table.bigInteger('cat_id').references('category.id');
      table.bigInteger('resource_id').references('resources.id');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('cat_reso');
};
