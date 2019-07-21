const express = require('express');
const router  = express.Router({mergeParams:true})
const userHelper = require('../lib/userHelper');
const validator = require('../lib/validator');

router.get('/register', (req, res) => {
  res.render('users/register');
})

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

router.post('/forget', (req, res) => {
  const email = req.body.email;
  userHelper.findUserByEmail(email)
  .then(user => {
    if (!user) {
      res.send("This Account Does Not Exist");
    } else {
      return userHelper.resetHandler(email)
    }
  })
  .then(() => {
    res.redirect('/login')
  })
})

router.get('/reset/:token', (req, res) => {
  const token = req.params.token
  userHelper.findOneUserBy('password_reset_token', token)
  .then(user => {
    if (!user) {
      res.render('users/reset', {error: 'Invalid Token'})
    } else {
      let expiry = user.password_reset_token_expiry;
      let now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      if(new Date(now) > new Date(expiry)) {
        res.render('users/reset', {error: "Token Expired. It Was Valid Within One Hour"})
      } else {
        res.render('users/reset', {error: undefined, email: user.email})
      }
    }
  })
  
})

module.exports = router;