const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const performanceHelper = {
  fetchStudentPerformance: (studentId, year = null) => {
    const query = knex('performances').select('*').where('student_id', studentId)
    if (year) {
      query.andWhere('year', year).first()
    } else {
      query.whereRaw("year = (SELECT year FROM performances WHERE student_id = ? ORDER BY year DESC LIMIT 1)", [studentId]).first()
    }
    return query;
  },

  createStudentPerformance: (performance) => {
    return knex('performances').insert(performance, ['id'])
  },

  updateStudentPerformance: (performance) => {
    const studentId = performance.student_id;
    const year = performance.year
    return knex('performances')
          .where('student_id', studentId).andWhere('year', year)
          .update(performance)
  }
}

module.exports = performanceHelper;