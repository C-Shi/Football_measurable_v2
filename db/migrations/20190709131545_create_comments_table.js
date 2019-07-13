
exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(t) {
    t.increments('id');
    t.integer('student_id').unsigned().references('id').inTable('students').onDelete('CASCADE');
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('content').notNullable();
    t.datetime('created_at').notNullable().defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('comments');
};
