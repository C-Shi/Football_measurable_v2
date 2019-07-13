
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(t){
    t.increments('id');
    t.string('email').unique().notNullable();
    t.string('password').notNullable();
    t.string('name').notNullable();
    t.boolean('admin').notNullable().defaultTo(false);
    t.boolean('coach').notNullable().defaultTo(true);
    t.boolean('developer').notNullable().defaultTo(false);
    t.string('profile_url');
    t.string('password_reset_token');
    t.timestamp('password_reset_token_expiry').nullable().defaultTo(null);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
