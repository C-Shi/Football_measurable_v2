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
const path = require('path');
global.appRoot = path.resolve(__dirname);
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
  const { email, userId, name, admin, coach, developer } = req.session;
  if (email) {
    res.locals.user = { email, userId, name, coach, admin, developer};
  } else {
    res.locals.user = undefined;
  }
  return next()
})

// requrie routes
const studentsRoute = require('./routes/students');
const usersRoute = require('./routes/users');
app.get('/', (req, res) => {
  res.render('index');
})
app.use('/', studentsRoute);
app.use('/', usersRoute);

// custom 404 error handler
app.use((req, res, next) => {
  res.status(404);
  res.render('404', { error: 'We don\'t know this path' });
})

// custom 500 error handler
app.use((err, req, res, next) => {
  console.log('Server Throw a 500 Error');
  if (err) {
    console.error(err.message)
    const error = err.message;
    res.status(500);
    res.render('500', { error })
  }
})

app.listen(PORT, (req, res) => {
  console.log(`Server Start at ${PORT}`);
})
