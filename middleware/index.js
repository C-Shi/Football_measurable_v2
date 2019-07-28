const userHelper = require('../lib/userHelper');

module.exports = {
  isLogin: (req, res, next) => {
    if(req.session.email) {
      return next()
    } else {
      req.flash('error', 'Please Login First')
      res.redirect('/login');
    }
  },

  isNotLogin: (req, res, next) => {
    if(req.session.email) {
      req.flash('info', 'You Have Already Login! Welcome');
      res.redirect('/students');
    } else {
      return next()
    }
  },

  isCoach: (req, res, next) => {
    userHelper.findUserByEmail(email)
    .then(user => {
      if(user.coach) {
        next()
      } else {
        req.flash('error', 'You are Unauthorized to Perform this action');
        res.redirect('back');
      }
    })
    .catch(error => {
      // server error
      res.send(error.message);
    })
  }, 

  
  
}