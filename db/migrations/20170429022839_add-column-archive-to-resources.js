
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table){
      table.boolean('archived');
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('resources', function(table){
      table.dropColumn('archived');
      })
    ]);

};
