require('dotenv').config();
const express = require('express');
const app = express();
const ENV = process.env.ENV || 'development';
const PORT = process.env.PORT || 3000;
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

app.listen(PORT, (req, res) => {
  console.log(`Server Start at ${PORT}`);
})
