const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const bcrypt = require('bcrypt');
const studentHelper = require('./studentHelper');
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



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
  },

  findUserByEmail: (email) => {
    return knex('users').select('*').where('email', email).first()
  },

  findOneUserBy: (column, value) => {
    return knex('users').select('*').where(column, value).first()
  },

  changePassword: (email, token, password) => {
    const hash = bcrypt.hashSync(password, 10);
    return knex('users').where('password_reset_token', token).andWhere('email', email).update({password: hash, password_reset_token: null, password_reset_token_expiry: null}).returning('*')
  },

  resetHandler: (email) => {
    const token = randomByte();
    // expiry one hour from now
    let expiry = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
    return knex('users').where('email', email).update({password_reset_token: token, password_reset_token_expiry: expiry})
    .then(() => {
      const msg = {
        to: email,
        from: 'no-reply@mtmfootball.com',
        subject: 'Password Reset Email',
        text: `localhost:3000/reset/${token}`,
        html: `<a href="localhost:3000/reset/${token}">localhost:3000/reset/${token}</a`,
      };
      return sgMail.send(msg);
    })
  },

}

module.exports = userHelper;