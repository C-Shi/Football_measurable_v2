    
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

  fetchStudentPerformance: (studentId, year = null) => {
    const query = knex('performances').select('*').where('student_id', studentId)
    if (year) {
      query.andWhere('year', year).first()
    } else {
      query.whereRaw("year = (SELECT year FROM performances WHERE student_id = ? ORDER BY year DESC LIMIT 1)", [studentId]).first()
    }
    return query;
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

  createStudentPerformance: (performance) => {
    return knex('performances').insert(performance, ['id'])
  }
}

module.exports = studentHelper;