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

    if(!profile) throw new Error('Invalid Student');
    res.render("students/show", { profile, performance, comments})
  })
  .catch(error => {
    res.send(error.message)
  })
})

router.get('/students/:id/edit', (req, res) => {
  const studentId = req.params.id;
  studentHelper.fetchStudentById(studentId)
  .then(profile => {
    res.render('students/edit', { profile })
  })
})

router.post('/students', (req, res) => {

})

router.put('/students/:id/update', (req, res) => {
  const studentId = req.params.id;
  const profile = req.body;
  studentHelper.updateStudentById(studentId, profile)
  .then(() => {
    res.redirect(`/students/${studentId}`);
  })
  .catch(error => {
    res.send(error.message);
  })
})

router.delete('/students/:id', (req, res) => {
  const studentId = req.params.id;
  studentHelper.deleteStudentById(studentId)
  .then((row) => {
    if(row === 1) {
      res.redirect('/students')
    } else if (row === 0) {
      res.redirect('back');
    }
  })
  .catch(error => res.send(error.message))
})

module.exports = router;