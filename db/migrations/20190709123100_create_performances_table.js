
exports.up = function(knex, Promise) {
  return knex.schema.createTable('performances', function(t) {
    t.increments('id');
    t.integer('student_id').unsigned().references('id').inTable('students').onDelete('CASCADE');
    t.string('broad');
    t.string('vertical');
    t.string('forty_first');
    t.string('forty_second');
    t.string('shuttle_first_L');
    t.string('shuttle_second_R');
    t.string('year').notNullable();
    t.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('performances');
};