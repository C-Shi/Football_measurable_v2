const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const bcrypt = require('bcrypt');
const studentHelper = require('./studentHelper');
const crypto = require('crypto')
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
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
      const resetURL = `${process.env.ROOT}/reset/${token}`;
      let template = fs.readFileSync(`${appRoot}/public/template/password_reset.html`,{encoding:'utf-8'});
      template = template.replace(/PASSWORD_URL/g, resetURL);
      template = template.replace(/CLUB_NAME/g, process.env.CLUB_NAME);
      const msg = {
        to: email,
        from: 'no-reply@mtmfootball.com',
        subject: 'Password Reset Email',
        text: `Please reset your password at: ${process.env.ROOT}/reset/${token}`,
        html: template,
      };
      return sgMail.send(msg);
    })
  },

  fetchAllUsers: () => {
    return knex('users').select('id', 'email', 'name', 'admin', 'coach', 'developer').orderBy('name')
  }, 

  updateUserRole: (id, data, returning = true) => {
    const query = knex('users').update(data).where('id', id)
    if(returning) {
      return query.then(() => {
        return knex('users').where('id', id).select(Object.keys(data)).first()
      })
    } else {
      return query;
    }
  }, 

  removeUser: (id, name) => {
    return knex('users').where('id', id).andWhere('name', name).del().then(() => {
      return knex('users').where('id', id).first()
    })
  }, 

  roleSanitizer: (data) => {
    const roles = ['admin', 'developer', 'coach'];
    for(key in data) {
      // sanitized unwanted data
      if (roles.indexOf(key) == -1 ) {
        delete data.key;
        continue;
      } else {
        data[key] = (data[key] === 'true') ? 1 : 0;
      }
    }
    return data;
  }

}

module.exports = userHelper;