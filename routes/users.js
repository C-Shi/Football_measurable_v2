const express = require('express');
const router  = express.Router({mergeParams:true})
const userHelper = require('../lib/userHelper');
const validator = require('../lib/validator');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'test@example.com',
//   from: 'test@example.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);

// router.get('/register', (req, res) => {
//   res.render('users/register');
// })

router.post('/register', async (req, res) => {
  const user = Object.assign({}, req.body);
  user.admin = user.admin ? true : false;
  user.coach = user.coach ? true : false;
    validator.isEmail(user.email)
    .then(() => {
      return validator.userValidator.isUniqueUser(user.email)
    })
    .then(isUnique => {
      if(isUnique) {
        return userHelper.register(user)
      } else {
        throw new Error('duplicate Email')
      }
    })
    .then(newUser => {
      res.redirect('/students');
    })
    .catch(error => {
      res.send(error.message)
    })
})

router.get('/login', (req, res) => {
  res.render('users/login');
})

router.post('/login', (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  userHelper.authenticate(email, password)
  .then(auth => {
    if(auth) {
      req.session.email = auth.email;
      req.session.userId = auth.id;
      req.session.name = auth.name;
      res.redirect('/students');
    } else {
      res.send('The account does not exist or password incorrect')
    }
  })
  .catch(error => {
    res.send(error.message)
  })
})

router.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
})




module.exports = router;