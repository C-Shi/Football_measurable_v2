const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');

router.get('/students', (req, res) => {

})

router.get('/students/datatable', (req, res) => {
  studentHelper.fetchStudents()
  .then(students => res.json(students))
  .catch(error => res.send(error.message))
})

router.get('/students/:id', (req, res) => {

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