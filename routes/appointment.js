const express = require('express');
const appointment = require('../models/appointment');
const router = express.Router();



router.post('/', (req, res) => {
    reservation = new appointment({
        patient: req.body.patient,
        doctor: req.body.doctor,
        appointmentDate: new Date(req.body.appointmentDate).toDateString(),
        appointmentTime: req.body.appointmentTime
    })
    reservation.save().then(result => res.status(200).json({ message: 'Appointment has been saved' }))
})




router.post('/getReservations', (req, res) => {

    var appointmentDate = new Date(req.body.appointmentDate).toDateString();

    const doctor = req.body.doctor;
    appointment.find({ appointmentDate: appointmentDate, doctor: req.body.doctor }).then(

        appointments => {
            res.status(200).json({ appointments: appointments })

        })


})

router.get('/getPatientReservations/:id', (req, res) => {

    let currentDateTemp = new Date();
    currentDateTemp.setDate(currentDateTemp.getDate()-1)

    let patient=req.params.id;
    appointment.find({patient:patient}).populate('patient').populate('doctor').then(appointments => {

        appointmentsFiltered = appointments.filter(item => {
            
            let storedDate = new Date(item.appointmentDate);
            return storedDate.getTime() >= currentDateTemp.getTime()

        });
        res.status(200).json({  appointments: appointmentsFiltered  })
    })

})



router.get('/', (req, res) => {

    appointment.find({}).then(
        appointments => {
            res.status(200).json({ appointments: appointments })
        })
})

router.post('/getSpecificReservation', (req, res) => {

    console.log(`${req.body.appointmentDate}  ${req.body.doctor._id}   ${req.body.appointmentTime}`)

    appointment.find({ doctor: req.body.doctor._id, appointmentDate: new Date(req.body.appointmentDate).toDateString(), appointmentTime: req.body.appointmentTime })
        .populate('patient').then(
            appointments => {
                res.status(200).json({ appointments: appointments })
            })
})

router.get('/deleteAppointment/:id', (req, res) => {
    appointment.deleteOne({ _id: req.params.id }).then(
        appointment => {
            res.status(200).json({ appointment: appointment })
        })
})

router.delete('/', (req, res) => {
    appointment.deleteMany({}).then(
        appointment => {
            res.status(200).json({ appointment: appointment })
        })
})

module.exports = router;
