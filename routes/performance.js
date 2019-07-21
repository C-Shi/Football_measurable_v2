const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const performanceHelper = require('../lib/performanceHelper');
const validator = require('../lib/validator');

// add a performance record
router.post('/', (req, res) => {
  const studentId = req.params.id;
  const rawPerformance = req.body;
  const performance = requestHelper.formatPerformance(studentId, rawPerformance);
  // performance request validation
  Promise.all([
    validator.isYear(performance.year),
    validator.performanceValidator.duplicateYear(performance)
  ])
  .then(() => {
    return performanceHelper.createStudentPerformance(performance)
  })
  .then(() => {
    res.redirect(`/students/${studentId}?year=${performance.year}`)
  })
  .catch(error => {
    res.send(error.message);
  })
})

// update a performance record
router.put('/', (req, res) => {
  const studentId = req.params.id;
  const rawPerformance = req.body;
  const performance = requestHelper.formatPerformance(studentId, rawPerformance);
})

module.exports = router;