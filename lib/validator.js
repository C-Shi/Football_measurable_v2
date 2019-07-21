const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

module.exports = {
  isYearSync: (year) => {
    if(!Number(year)) {
      return new Error('Incorrect Year Format')
    } else if (Number(year) < 1900 || Number(year) > 2100) {
      return new Error('Year is too small or too large')
    } else {
      return true;
    }
  }, 

  isYear: (year) => {
    return new Promise((resolve, reject) => {
      if (!Number(year)) {
        reject(new Error('Incorrect Year Format'))
      } else if (Number(year) < 1900 || Number(year) > 2100) {
        reject(new Error('Year is too small or too large'))
      } else {
        resolve(Number(year))
      }
    })
  }, 

  performanceValidator: {
    duplicateYear: (performance) => {
      const year = performance.year;
      const student_id = performance.student_id
      return knex('performances')
             .where('year', year).andWhere('student_id', student_id).first()
             .then(performance => {
               if (performance) {
                 throw new Error('Duplicate Year Entry, Please Edit Corresponding data');
               } else {
                 return true;
               }
             })
    }, 

    duplicateYearSync: async (year) => {
      const result = await knex('performances').where('year', year).andWhere('student_id', student_id).first()
      if (result) {
        return new Error('Duplicate Year Entry, Please Edit Corresponding data');
      } else {
        return true;
      }
    }
  }
}