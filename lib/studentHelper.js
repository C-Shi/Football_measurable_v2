    
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const studentHelper = {
  fetchStudents: () => {
    return knex('students').select('*')
  }
}

module.exports = studentHelper;