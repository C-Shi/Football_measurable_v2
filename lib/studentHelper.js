    
const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const studentHelper = {
  fetchStudents: () => {
    return knex('students').select('*')
  },

  fetchStudentById: (id) => {
    return knex('students').select('*').where('id', id).first()
  },

  updateStudentById: (studentId, profile) => {
    return knex('students').where('id', studentId)
          .update(profile)
  },

  deleteStudentById: (studentId) => {
    return knex('students').where('id', studentId).del();
  },

  createStudentProfile: (student) => {
    return knex('students').insert(student, ['id'])
  },
}

module.exports = studentHelper;