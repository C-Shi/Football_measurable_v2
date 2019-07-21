const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const commentHelper = require('../lib/commentHelper');
const performanceHelper = require('../lib/performanceHelper');

// config image upload to cloudinary **************************
const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dhi1ngld5',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
// ******************************************************

// include performance route
const commentRoute = require('./comments');
const performanceRoute = require('./performance');

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

router.get('/students/new', (req, res) => {
  res.render('students/new');
})

router.get('/students/:id', (req, res) => {
  const studentId = req.params.id
  let year = Number(req.query.year);
  if(!(year && year > 2000 && year < 2050)) {
    year = null;
  }
  Promise.all([
    studentHelper.fetchStudentById(studentId),
    performanceHelper.fetchStudentPerformance(studentId, year),
    commentHelper.fetchStudentComments(studentId)
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

router.post('/students', upload.single('image'), (req, res) => {
  const profile = requestHelper.formatStudentInfo(req.body);
  let new_student_id;
  const image = req.file ? req.file.path : "https://res.cloudinary.com/dhi1ngld5/image/upload/v1532544942/default_avatar.png"


  // create student profile
  studentHelper.createStudentProfile(profile)
  .then(id => {
    if (id) {
      new_student_id = id[0];
      // if adding performance data is required, then perform this
      if(Number(req.body.performance)) {
        const performance = requestHelper.formatPerformance(id[0], req.body)
        return performanceHelper.createStudentPerformance(performance)
      }
    } else {
      throw new Error('Insersion Error, No student inserted')
    }
  })
  .then((performance_id) => {
    res.redirect(`/students/${new_student_id}`)
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

router.use('/students/:id/comment', commentRoute);
router.use('/students/:id/performance', performanceRoute);

module.exports = router;