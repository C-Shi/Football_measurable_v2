
exports.up = function(knex, Promise) {
  return knex.schema.createTable('student', function(t){
    t.increments('id');
    t.string('first_name').notNull();
    t.string('last_name').notNull();
    t.string('school');
    t.integer('grade').notNull();
    t.string('arm_span');
    t.string('height');
    t.string('weight');
    t.string('position');
    t.string('image');
    t.string('image_id');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('student');
};
