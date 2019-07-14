const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');

router.get('/students', (req, res) => {
  res.render('students/index');
})

router.get('/students/datatable', (req, res) => {
  studentHelper.fetchStudents()
  .then(students => {
     const data = students.map(student => {
      return {
        ...student,
        name: `${student.first_name} ${student.last_name}`,
        more: `<a href="/students/${student.id}" class="btn btn-primary btn-sm">Detail</a><a href="/students/${student.id}/edit" class="btn btn-success btn-sm">Edit</a>`
      }
    })
    res.send({data});
  })
  .catch(error => console.log(error))
})

router.get('/students/:id', (req, res) => {
  const studentId = req.params.id
  Promise.all([
    studentHelper.fetchStudentById(studentId),
    studentHelper.fetchStudentPerformance(studentId),
    studentHelper.fetchStudentComments(studentId)
  ])
  .then(results => {
    const profile = results[0];
    const performance = results[1];
    const comments = results[2];
    res.json({profile, performance, comments})
  })
  .catch(error => {
    res.send(error.message)
  })
})

router.get('/students/:id/edit', (req, res) => {

})

router.post('/students', (req, res) => {

})

router.put('/students/:id/update', (req, res) => {

})

router.delete('/students/:id', (req, res) => {

})

module.exports = router;