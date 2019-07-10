
exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', function(t){
    t.increments('id');
    t.string('first_name').notNullable();
    t.string('last_name').notNullable();
    t.string('school');
    t.integer('grade').notNullable();
    t.string('arm_span');
    t.string('height');
    t.string('weight');
    t.string('position');
    t.string('image');
    t.string('image_id');
    t.string('strength');
    t.string('weakness');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('students');
};
