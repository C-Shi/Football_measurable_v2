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

  createComment: (student_id, content) => {
    return knex('comments')
           .insert({student_id, user_id, content})
  },

  deleteComment: (comment_id) => {
    return knex('comments')
          .where('id', comment_id)
          .del()
  },

  findCommentById: (comment_id) => {
    return knex('comments').where('id', comment_id).select('*').first()
  }
}

module.exports = commentHelper;