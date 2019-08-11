const express = require('express');
const router  = express.Router({mergeParams:true})
const studentHelper = require('../lib/studentHelper');
const requestHelper = require('../lib/requestHelper');
const userHelper = require('../lib/userHelper');
const commentHelper = require('../lib/commentHelper');
const performanceHelper = require('../lib/performanceHelper');
const validator = require('../lib/validator');
const middleware = require('../middleware');

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

router.get('/students', (req, res, next) => {
  res.render('students/index');
})

router.get('/students/datatable', 
// add modify and delete option if authorized user login
(req, res, next) => {
  if(req.session.email) {
    userHelper.findUserByEmail(req.session.email)
    .then(user => {
      if (user.coach || user.developer) {
        req.authorizedToModify = true;
      }
      return next();
    })
    .catch(error => {
      // server error
      return next(error);;
    })
  } else {
    return next();
  }
}, 
(req, res, next) => {
  studentHelper.fetchStudents()
  .then(students => {
     const data = students.map(student => {
      let option = `<a href="/students/${student.id}" class="btn btn-primary btn-sm">Detail</a>`;
      if (req.authorizedToModify) {
        option += `<a href="/students/${student.id}/edit" class="btn btn-success btn-sm">Edit</a><form class="d-inline" action="/students/${student.id}?_method=DELETE" onsubmit="return confirm('Do you really want to delete ${student.first_name} ${student.last_name}? This action cannot be undo');" method="POST"><button class="btn btn-danger btn-sm">Delete</button></form>`;
      }
      return {
        ...student,
        name: `${student.first_name} ${student.last_name}`,
        more: option
      }
    })
    res.send({data});
  })
  .catch(error => next(error))
})

router.get('/students/new', middleware.isLogin, middleware.isCoach, (req, res, next) => {
  res.render('students/new');
})

router.get('/students/:id', (req, res, next) => {
  if (!Number(req.params.id)) {
    req.flash('error', 'Opp!. Invalid Student ID');
    return res.redirect('/students');
  }
  const studentId = req.params.id
  const year = validator.isYearSync(req.query.year) ? req.query.year : null;
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
    return next(error);
  })
})


router.post('/students', middleware.isLogin, middleware.isCoach, upload.single('image'), (req, res, next) => {
  const profileError = validator.studentValidator.profileMissing(req.body);
  if (profileError) {
    req.flash('error', profileError);
    return res.redirect('back');
  };
  const profile = requestHelper.formatStudentInfo(req.body);
  let new_student_id;
  const image = req.file ? req.file.path : "https://res.cloudinary.com/dhi1ngld5/image/upload/v1532544942/default_avatar.png"

  cloudinary.uploader.upload(image)
  .then(result => {
    profile.image = result.secure_url
    profile.image_id = result.public_id
    // create student profile
    return studentHelper.createStudentProfile(profile)
  })
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
    return next(error);
  })
})

router.get('/students/:id/edit', middleware.isLogin, middleware.isCoach, (req, res, next) => {
  const studentId = req.params.id;
  studentHelper.fetchStudentById(studentId)
  .then(profile => {
    res.render('students/edit', { profile })
  })
  .catch(error => next(error));
})


router.put('/students/:id/update', middleware.isLogin, middleware.isCoach, upload.single('image'), (req, res, next) => {
  const studentId = req.params.id;
  const profile = req.body;

  // check if there is a file upload
  if (req.file) {
    const image = req.file ? req.file.path : "https://res.cloudinary.com/dhi1ngld5/image/upload/v1532544942/default_avatar.png"
    studentHelper.fetchStudentById(studentId)
    .then(student => {
      const image_id = student.image_id;
      return cloudinary.v2.uploader.destroy(image_id)
    })
    .then(() => {
      return cloudinary.uploader.upload(image)
    })
    .then(result => {
      profile.image = result.secure_url;
      profile.image_id = result.image_id;
      return studentHelper.updateStudentById(studentId, profile)
    })
    .then(() => {
      res.redirect(`/students/${studentId}`);
    })
    .catch(error => {
      return next(error);;
    })
  } else {
    studentHelper.updateStudentById(studentId, profile)
    .then(() => {
      res.redirect(`/students/${studentId}`);
    })
    .catch(error => {
      return next(error);;
    })
  }
})

router.delete('/students/:id', middleware.isLogin, middleware.isCoach, (req, res, next) => {
  const studentId = req.params.id;
  studentHelper.fetchStudentImageById(studentId)
  .then(result => {
    if (!result) {
      throw new Error('Invalid Student Id')
    }
    const imageId = result.image_id
    return cloudinary.v2.uploader.destroy(imageId)
  })
  .then(() => {
    return studentHelper.deleteStudentById(studentId)
  })
  .then((row) => {
    if(row === 1) {
      res.redirect('/students')
    } else if (row === 0) {
      res.redirect('back');
    }
  })
  .catch(error => next(error))
})

router.use('/students/:id/comment', middleware.isLogin, middleware.isCoach, commentRoute);
router.use('/students/:id/performance', middleware.isLogin, middleware.isCoach, performanceRoute);

module.exports = router;