require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const flash = require('connect-flash')
const app = express();
const ENV = process.env.ENV || 'development';
const PORT = process.env.PORT || 3000;
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(flash())

app.use(require("express-session")({
  secret: "Do you love me?",
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next){
  // locals refers to whatever ejs file the request is getting to
  // this code ensure that in all ejs file we have access to the logged in user as "currentUser"
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get('/', (req, res) => {
  res.render('landing');
})

app.listen(PORT, (req, res) => {
  console.log(`Server Start at ${PORT}`);
})
