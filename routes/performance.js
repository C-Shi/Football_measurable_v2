const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const performanceHelper = require('../lib/performanceHelper');
const validator = require('../lib/validator');
const middleware = require('../middleware');

// add a performance record
router.post('/', middleware.isCoach, (req, res) => {
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
router.put('/', middleware.isCoach, (req, res) => {
  const studentId = req.params.id;
  const rawPerformance = req.body;
  const performance = requestHelper.formatPerformance(studentId, rawPerformance);
  // validator
  Promise.all([
    validator.performanceValidator.hasEntry(performance),
    validator.isYear(performance.year)
  ])
  .then(() => {
    return performanceHelper.updateStudentPerformance(performance)
  })
  .then(() => {
    res.redirect(`/students/${studentId}?year=${performance.year}`)
  })
  .catch(error => {
    res.send(error.message);
  })
})

module.exports = router;