const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const commentHelper = require('../lib/commentHelper');

router.post('/', (req, res, next) => {
  const studentId = req.params.id;
  const content = req.body.comment;
  const userId = req.session.userId
  commentHelper.createComment(studentId, content, userId)
  .then(() => res.redirect(`/students/${studentId}`))
  .catch(error => {
    return next(error);
  })
})

router.delete('/:commentId', 
// middleware checking if comment belongs to user
(req, res, next) => {
  const commentId = req.params.commentId;
  commentHelper.findCommentById(commentId)
  .then(foundComment => {
    if(!foundComment) {
      req.flash('error', 'Unable to find associated comment');
      return redirect('back');
    }
    if (foundComment.user_id !== req.session.userId) {
      req.flash('error', 'You cannot delete other\'s comment');
      return redirect('back');
    }
    return next();
  })
  .catch(error => {
    // server error
    return next(error);;
  })
}, 
(req, res, next) => {
  const commentId = req.params.commentId;
  const studentId = req.params.id;
  const userId = req.session.userId;
  commentHelper.deleteComment(commentId, userId)
  .then(() => {
    res.redirect(`/students/${studentId}`)
  })
  .catch(error => {
    //server error
    return next(error);;
  })
})

module.exports = router;