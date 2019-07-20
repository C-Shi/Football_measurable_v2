const ENV         = process.env.ENV || "development";
const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const commentHelper = {
  fetchStudentComments: (studentId) => {
    return knex('comments')
          .innerJoin('users', 'users.id', 'comments.user_id')
          .select("comments.id", "comments.content", "comments.created_at", "users.name")
          .where('student_id', studentId)
  },

  createComment: (student_id, user_id, content) => {

  },

  deleteComment: (comment_id, user_id = 1) => {
    return knex('comments')
          .where('user_id', user_id)
          .andWhere('id', comment_id)
          .returning(['id'])
          .del()
  }
}

module.exports = commentHelper;