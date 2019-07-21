const express = require('express');
const router  = express.Router({mergeParams:true})
const userHelper = require('../lib/userHelper');

router.get('/register', (req, res) => {

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