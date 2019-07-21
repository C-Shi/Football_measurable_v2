const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const bcrypt = require('bcrypt');
const studentHelper = require('./studentHelper');
const crypto = require('crypto')

function randomByte () {
  return crypto.randomBytes(64).toString('hex');
}
const userHelper = {
  authenticate: (email, password) => {
    return knex('users').select('id', 'email','password', 'name', 'admin', 'coach', 'developer', 'profile_url')
    .where('email', email).first()
    .then(student => {
      if (!student) {
        return false;
      } 
      let auth = bcrypt.compareSync(password, student.password);
      if (auth) {
        return student;
      } else {
        return false;
      }
    })
  },

  register: (user) => {
    let password = randomByte();
    password = bcrypt.hashSync(password, 10);
    user.password = password;
    return knex('users').insert(user).returning('*')
  }
}

module.exports = userHelper;