const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const commentHelper = require('../lib/commentHelper');

router.delete('/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  const studentId = req.params.id;
  commentHelper.deleteComment(commentId)
  .then(id => {
    if (id.length == 0) {
      // unauthorized action
    }
    res.redirect(`/students/${studentId}`)
  })
  .catch(error => {
    res.send(error.message);
  })
})

module.exports = router;