const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const performanceHelper = require('../lib/performanceHelper');
const validator = require('../lib/validator');

router.post('/', (req, res) => {
  const studentId = req.params.id;
  const rawPerformance = req.body;
  const performance = requestHelper.formatPerformance(studentId, rawPerformance);
  console.log(performance);
  validator.isYear(performance.year)
  .then(yr => {
    return performanceHelper.createStudentPerformance(performance)
  })
  .then(() => {
    res.redirect(`/students/${studentId}?year=${performance.year}`)
  })
  .catch(error => {
    res.send(error.message);
  })
})

module.exports = router;