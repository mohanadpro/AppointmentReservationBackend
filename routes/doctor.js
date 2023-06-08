var express = require('express');
const multer = require('multer');
const { SERVER_URL, NUM_ELEMENT_IN_PAGE } = require('../config');
var router = express.Router();
var Doctor = require('../models/doctor');
var Patient = require('../models/patient');

const Auth = require('../Authentication/auth.js');
const appointment = require('../models/appointment');
const fileFilter = function (req, file, cb) {
      Doctor.findOne({ name: req.body.name })
            .then(result => {
                  if (result)
                        cb(new Error('Doctor is already found'), false);
                  else {
                        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png')

                              cb(null, true);
                        else
                              cb(new Error("Please upload file with type JPG|PNG|JPEG"))
                  }
            })
            .catch(err => cb(new Error(err.message)), false)
}

// when and what name should the file take
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, './doctor_images/')
      },
      filename: function (req, file, cb) {
            cb(null, new Date().toDateString() + file.originalname)
      }
})

var upload = multer({
      storage: storage,
      fileFilter: fileFilter
})


router.post('/', upload.single('image'), (req, res) => {
      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            var doctorName = req.body.name;
            Doctor.find({ name: doctorName }).then(cats => {
                  if (cats.length >= 1) {
                        res.status(404).json({ message: 'Doctor' + doctorName + 'is already found' })
                  }
                  else {
                        const doctor = Doctor({
                              name: doctorName,
                              image: req.file ? new Date().toDateString() + req.file.originalname : null
                        })
                        doctor.save()
                              .then(doctor => {
                                    res.status(200).json({ message: 'Doctor has benn saved successfully...' })
                              })
                              .catch(err => {
                                    res.status(404).json({ message: err.message })
                              })
                  }
            }).catch(
                  err =>
                        res.status(404).json({ message: err.message })
            )
      }
})




router.patch('/:id', (req, res) => {
      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            const newDoctor = {
                  name: req.body.name,
                  price: req.body.price,
                  quantity: req.body.quantity
            }
            Doctor.findOneAndUpdate({ _id: req.params.id }, { $set: newDoctor })
                  .then(result => {
                        if (result)
                              res.status(201).json({ message: 'Doctor has been updated successfully...' })
                        else
                              res.status(404).json({ message: 'Doctor is not found' })
                  })
                  .catch(err => {
                        res.status(404).json({ message: err.message });
                  })
      }
})
router.get('/', (req, res) => {

      Doctor.find({}).then(doctors => res.status(200).json(
            {
                  data: doctors.map(item => {
                        return {
                              _id: item._id,
                              name: item.name,
                              url: SERVER_URL + item.image
                        }
                  })
            }))
            .catch(err => {
                  res.status(404).json({ message: err.message })
            })
})




router.get('/withPagination/:pageNumber', (req, res) => {

      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            var token = req.get('Authorization');
            const obj = new Auth(token);
            if (obj.isAuthentication() == false) {
                  res.status(404).json({ message: "User Is Not Authenticated" });
            }

            else {
                  var pageNumber = req.params.pageNumber;
                  Doctor.find({}).then(totalCateogries => {
                        var totalPages = Math.ceil(totalCateogries.length / NUM_ELEMENT_IN_PAGE);
                        Doctor.find({}).limit(parseInt(NUM_ELEMENT_IN_PAGE)).skip(pageNumber * NUM_ELEMENT_IN_PAGE)
                              .then(doctors => res.status(200).json({
                                    data: {
                                          "doctors": doctors.map(item => {
                                                return {
                                                      _id: item._id,
                                                      name: item.name,
                                                      url: SERVER_URL + item.image
                                                }
                                          }),
                                          "totalPages": totalPages
                                    }
                              })).catch(err => {
                                    console.log(err.message)
                                    res.status(404).json({ message: err })
                              })
                  }).catch(err => {
                        console.log(err.message)

                        res.status(404).json({ message: err })
                  })
            }
      }
})


router.get('/getDoctorByName/:name', (req, res) => {
      console.log(req.params.name);
      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            var token = req.get('Authorization');
            const obj = new Auth(token);
            if (obj.isAuthentication() == false) {
                  res.status(404).json({ message: "User Is Not Authenticated" });
            }

            else {
                  Doctor.find({ name: req.params.name })
                        .then(doctors => res.status(200).json({
                              data: {
                                    "doctors": doctors.map(item => {
                                          return {
                                                _id: item._id,
                                                name: item.name,
                                                url: SERVER_URL + item.image
                                          }
                                    }),
                                    "totalPages": 1
                              }
                        }));
            }
      }
})

router.get('/deleteDoctor/:id', (req, res) => {
      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            Doctor.findByIdAndDelete({ _id: req.params.id })
                  .then(result =>
                        appointment.deleteMany({ doctor: req.params.id }).then(deletedPatient => {
                              Patient.deleteMany({ doctor: req.params.id }).then(rs1 => {
                                    res.status(200).json({ message: 'Doctor has been deleted successfully' });
                              })
                        }).catch(err => {
                              res.status(404).json({ message: err.message });
                        })).catch(err => {
                              res.status(404).json({ message: err.message });
                        })
      }
})

module.exports = router;
