require('dotenv').config();
const express = require('express');
const app = express();
const ENV = process.env.ENV || 'development';
const PORT = process.env.PORT || 3000;
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const bodyParser = require('body-parser');

// app configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"))

// requrie routes
const studentsRoute = require('./routes/students');
app.use('/', studentsRoute);

app.listen(PORT, (req, res) => {
  console.log(`Server Start at ${PORT}`);
})
