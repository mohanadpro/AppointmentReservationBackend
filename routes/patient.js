const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

const { SERVER_URL, NUM_ELEMENT_IN_PAGE } = require('../config');
const Auth = require('../Authentication/auth.js');
const patient = require('../models/patient');
const appointment = require('../models/appointment');


router.get('/', (req, res) => {

      Patient.find({ }).populate('doctor').select('-__v')
            .then(patients => {
                  console.log(patients);
                  res.status(200).json(
                        { data: { "patients": patients, "totalPages": 1 } })
            }).catch(err => { res.status(404).json({ message: err.message }) })
})


router.get('/:id', (req, res) => {

      Patient.find({ _id: req.params.id }).populate('doctor').select('-__v')
            .then(patients => {
                  console.log(patients);
                  res.status(200).json(
                        { data: { "patients": patients, "totalPages": 1 } })
            }).catch(err => { res.status(404).json({ message: err.message }) })
})


router.get('/getPatientByInsuranceNumber/:id', (req, res) => {

      Patient.find({ insuranceNumber: req.params.id }).populate('doctor').select('-__v')
            .then(patients => {
                  console.log(patients);
                  res.status(200).json(
                        { data: { "patients": patients, "totalPages": 1 } })
            }).catch(err => { res.status(404).json({ message: err.message }) })
})


router.get('/withPagination/:pageNumber', async (req, res) => {

      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            var pageNumber = req.params.pageNumber;
            var totalPatientPages = await Patient.find().then(allPatients => {

                  return Math.ceil(allPatients.length / NUM_ELEMENT_IN_PAGE);
            });

            var patients = await Patient.find({}).populate('doctor')
                  .limit(parseInt(NUM_ELEMENT_IN_PAGE))
                  .skip(pageNumber * NUM_ELEMENT_IN_PAGE)
                  .select('-__v')
                  .then(results => {

                        res.status(200).json({ data: { "patients": results, "totalPages": totalPatientPages } })
                  })
      }
})



router.get('/:id', (req, res) => {
      Patient.findById(req.params.id).select('-__v')
            .then(patient => {
                  res.status(200).json({
                        patient: patient
                  })
            })
            .catch(err => { res.status(404).json({ message: err }) })
})

router.post('/', (req, res, next) => {
      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            var sendedName = req.body.name;
            Patient.find({ name: sendedName }).then(patients => {
                  if (patients.length > 0) {
                        res.status(404).json({ message: sendedName + ' is already saved' })
                  }
                  else {
                        var newPatient = new Patient({
                              name: req.body.name,
                              doctor: req.body.doctor,
                              insuranceNumber: req.body.insuranceNumber,
                              fileNumber: req.body.fileNumber,
                              mobileNumber: req.body.mobileNumber,
                              email: req.body.email,
                        });
                        newPatient.save()
                              .then(result => {
                                    res.status(200).json({ message: 'Patient has been created successfully...' })
                              })
                              .catch(err => {
                                    console.log(err);
                                    res.status(404).json({ message: err })
                              })
                  }
            }).catch(err => {
                  console.log(err);
            })
      }
})

router.get('/deletePatient/:id', (req, res) => {
      var token=req.get('Authorization');     
      const obj=new Auth(token);
      if(obj.isAuthentication()==false)
      {
           res.status(408).json({message:"User Is Not Authenticated"});
      }
      else
      {              
      Patient.findByIdAndDelete({ _id: req.params.id })
            .then(result => {
                  appointment.deleteMany({patient:req.params.id}).then(deletedPatient=>{
                        res.status(200).json({ message: 'Patient has been deleted successfully...' })
                  }).catch(err=>{
                        res.status(404).json({message:err.message});
                  })
            })
            .catch(err => {
                  res.status(404).json({ message: err.message })
            })
      }
})

router.delete('/', (req, res) => {
      var token=req.get('Authorization');     
      const obj=new Auth(token);
      if(obj.isAuthentication()==false)
      {
           res.status(408).json({message:"User Is Not Authenticated"});
      }
      else
      {  
      Patient.deleteMany()
            .then(result => {
                  res.status(202).json({ message: 'Patients has been deleted successfully...' })
            })
            .catch(err => {
                  res.status(404).json({ message: err.message })
            })
      }
})


router.patch('/:id', (req, res) => {
      var token = req.get('Authorization');
      const obj = new Auth(token);
      if (obj.isAuthentication() == false) {
            res.status(408).json({ message: "User Is Not Authenticated" });
      }
      else {
            let newPatient = {
                  _id: req.body._id,
                  name: req.body.name,
                  doctor: typeof req.body.doctor == 'object' ? req.body.doctor._id : req.body.doctor,
                  insuranceNumber: req.body.insuranceNumber,
                  fileNumber: req.body.fileNumber,
                  mobileNumber: req.body.mobileNumber,
                  email: req.body.email,
            }
            Patient.findOneAndUpdate({ _id: req.params.id }, { $set: newPatient })
                  .then(result => {
                        if (result)
                              res.status(201).json({ message: 'Patient has been updated successfully...' })
                        else
                              res.status(404).json({ message: 'Patient is not found' })
                  })
                  .catch(err => {
                        console.log(err.message);
                        res.status(404).json({ message: err.message });
                  })
      }
})

module.exports = router;