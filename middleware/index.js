const userHelper = require('../lib/userHelper');

module.exports = {
  isLogin: (req, res, next) => {
    if(req.session.email) {
      return next()
    } else {
      res.redirect('/login');
    }
  },

  isNotLogin: (req, res, next) => {
    if(req.session.email) {
      res.redirect('back');
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
        res.redirect('back');
      }
    })
    .catch(error => {
      // server error
      res.send(error.message);
    })
  }, 
  
}