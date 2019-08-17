const express = require('express');
const router  = express.Router({mergeParams:true})
const userHelper = require('../lib/userHelper');
const validator = require('../lib/validator');
const middleware = require('../middleware');

router.get('/register', middleware.isLogin, middleware.isAdmin, (req, res) => {
  res.render('users/register');
})

router.post('/register', middleware.isLogin, middleware.isAdmin, (req, res) => {
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

router.get('/login', middleware.isNotLogin, (req, res) => {
  res.render('users/login');
})

router.post('/login', middleware.isNotLogin, (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  userHelper.authenticate(email, password)
  .then(auth => {
    if(auth) {
      req.session.email = auth.email;
      req.session.userId = auth.id;
      req.session.name = auth.name;
      req.session.coach = auth.coach;
      req.session.developer = auth.developer;
      req.session.admin = auth.admin;
      res.redirect('/students');
    } else {
      res.send('The account does not exist or password incorrect')
    }
  })
  .catch(error => {
    res.send(error.message)
  })
})

router.post('/logout', middleware.isLogin, (req, res) => {
  req.session = null;
  res.redirect('/login');
})

router.post('/forget', middleware.isNotLogin, (req, res) => {
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

router.get('/reset/:token', middleware.isNotLogin, (req, res) => {
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
        res.render('users/reset', {error: undefined, email: user.email, token})
      }
    }
  })
})

router.post('/reset/:token', middleware.isNotLogin, (req, res) => {
  const token = req.params.token;
  const email = req.body.email;
  const password = req.body.password;
  if (!validator.userValidator.checkPasswordStrength(password)) {
    req.flash('error', 'Your password is too weak');
    req.flash('info', `<p>6 characters or more</p> <p>Has at least one lowercase and one uppercase alphabetical character</p> <p>Has at least one lowercase and one numeric character</p><p>Has at least one uppercase and one numeric character</p>`)
    return res.redirect('back');
  } else {
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
          // reset password
          return userHelper.changePassword(email, token, password)
        }
      }
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(error => {
      res.send(error);
    })
  }

})

router.get('/users', middleware.isLogin, (req, res, next) => {
  userHelper.fetchAllUsers()
  .then(users => {
    res.render('users/index', { users });
  })
  .catch(error => next(error))
})

router.put('/users/:id/update', middleware.isLogin, (req, res, next) => {
  const userId = req.params.id;
  const data = Object.assign({}, userHelper.roleSanitizer(req.body));
  userHelper.updateUserRole(userId, data)
  .then(response => {
    for(key in data) {
      if(data[key] !== response[key]) {
        throw new Error('Updated Failed');
      }
    }
    res.json({status: 'success'});
  })
  .catch(error => {
    console.error(error);
    res.status(400);
    res.json(error);
  })
})

module.exports = router;