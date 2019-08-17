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

// this update user role request is ajax
router.put('/users/:id/role/update', middleware.isLogin, 
// middleware checking if current user is authorized
  (req, res, next) => {
  // only admin and developer can update role, and cannot update themselves
  if ((req.session.admin || req.session.developer) && req.session.userId !== req.params.id) {
    return next();
  } else {
    res.status(403);
    return res.json({status: 'error'});
  }
  },
  (req, res, next) => {
  userHelper.findOneUserBy('id', req.params.id)
  .then(user => {
    if(!user) {
      res.status(400);
      return res.json({status: 'error'});
    } else if(user.developer) {
      res.status(403);
      return res.json({status: 'error'});
    } else {
      next();
    }
  })
  }, 
  (req, res, next) => {
    const userId = req.params.id;
    const data = Object.assign({}, userHelper.roleSanitizer(req.body));
    userHelper.updateUserRole(userId, data)
    .then(response => {
      // If no invalid id
      if(!response) {
        const error = new Error();
        error.code = 'ER_INVALID_ID';
        throw error;
      }
      for(key in data) {
        // if column does not update
        if(data[key] !== response[key]) {
          throw new Error('Updated Failed');
        }
      }
      res.json({status: 'success'});
    })
    .catch(error => {
      console.error(error);
      if(error.code == 'ER_BAD_FIELD_ERROR' || error.code == 'ER_INVALID_ID' || error.code == 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        res.status(400)
      } else {
        res.status(500);
      }
      res.json(error);
    })
  }
);

router.delete('/users/:id/delete', middleware.isLogin, middleware.isAdmin, (req, res, next) => {
  if(req.params.id === req.session.userId) {
    req.flash('error', 'You Cannot Delete Yourself');
    res.redirect('back');
  } else {
    userHelper.findOneUserBy('id', req.params.id)
    .then(user => {
      if (user.developer) {
        req.flash('error', 'You cannot remove this user');
        res.redirect('back');
      } else {
        return next();
      }
    })
    .catch(error => next(error))
  }
}, (req, res, next) => {
  const user = { id: req.params.id, name: req.body.name }
  userHelper.removeUser(user.id, user.name)
  .then(foundUser => {
    console.log(foundUser);
    // if user delete, should found nothing
    if (foundUser) {
      req.flash('error', 'User Is Not Removed');
    } else {
      req.flash('success', `User ${user.name} Has Been Removed`);
    }
    res.redirect('back');
  })
  .catch(error => next(error));
})

module.exports = router;