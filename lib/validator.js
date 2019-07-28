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

  isEmailSync: (email) => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  },

  isEmail: (email) => {
    const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return new Promise((resolve, reject) => {
      if (re.test(String(email).toLowerCase())) {
        resolve()
      } else {
        reject(new Error('Invalid Email'))
      }
    })
  },

  userValidator: {
    isUniqueUser: (email) => {
      return knex('users').select('email').where('email', email).first()
      .then(user => !user)
    }
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

    duplicateYearSync: async (performance) => {
      const year = performance.year;
      const student_id = performance.student_id
      const result = await knex('performances').where('year', year).andWhere('student_id', student_id).first()
      if (result) {
        return new Error('Duplicate Year Entry, Please Edit Corresponding data');
      } else {
        return true;
      }
    },

    hasEntry: (performance) => {
      const year = performance.year;
      const student_id = performance.student_id
      return knex('performances').select('id').where('year', year).andWhere('student_id', student_id).first()
      .then(id => {
        if (!id) {
          throw new Error('No corresponding record. Please insert new record')
        }
      })
    }
  },

  studentValidator: {
    profileMissing: (profile) => {
      let error = '';
      if (!profile.first_name) {
        error += "First Name cannot be empty. ";
      }
      if (!profile.last_name) {
        error += "Last Name cannot be empty. ";
      }
      if (!Number(profile.grade)) {
        error += "Grade should be a valid number. "
      } else if (Math.floor(Number(profile.grade)) !== Number(profile.grade)) {
        error += "Only Integer allowed for grade. "
      } else if (Number(profile.grade) < 1 || Number(profile.grade) > 16) {
        error += "Unrecognized Grade Number. "
      }

      return error; 
    }
  }
}