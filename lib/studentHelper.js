    
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

  fetchStudentComments: (studentId) => {
    return knex('comments')
          .innerJoin('users', 'users.id', 'comments.user_id')
          .select("comments.content", "comments.created_at", "users.name")
          .where('student_id', studentId)
  }
}

module.exports = studentHelper;