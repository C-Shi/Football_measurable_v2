require('dotenv').config();
const express = require('express');
const app = express();
const ENV = process.env.ENV || 'development';
const PORT = process.env.PORT || 3000;
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

// app configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use(methodOverride('_method'))
app.use(cookieSession({
  name: 'session',
  secret: 'This ensure the most secure application'
}))
app.use(flash())
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  res.locals.infoMessage = req.flash('info');
  // set global locals
  const { email, userId, name } = req.session;
  if (email) {
    res.locals.user = { email, userId, name};
  } else {
    res.locals.user = undefined;
  }
  return next()
})

// requrie routes
const studentsRoute = require('./routes/students');
const usersRoute = require('./routes/users');
app.use('/', studentsRoute);
app.use('/', usersRoute);

app.listen(PORT, (req, res) => {
  console.log(`Server Start at ${PORT}`);
})
