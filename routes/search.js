const express=require('express');
const router=express.Router();
const User=require('../models/users');
const { NUM_ELEMENT_IN_PAGE } = require('../config');
const patient = require('../models/patient');
const doctor = require('../models/doctor');



router.post('/',(req,res)=>{
    var typeOfSearch=req.body.typeOfSearch;
    var searchLetters=req.body.searchLetters;
    switch(typeOfSearch)
    {
        case 'Patients':
            patient.find({ name: { $regex : searchLetters,$options:'i'}})
            .then(results=>{
                res.setHeader('Content-Type','application/json')
                res.status(200).json({results:results})})
            .catch(err=>{res.status(404).json({err})});
            break;
        case 'Doctors':
            doctor.find({ name: { $regex : searchLetters,$options:'i'}})
            .then(results=>{
                res.setHeader('Content-Type','application/json')
                res.status(200).json({results})})
            .catch(err=>{res.status(404).json({err})})
            break;
    }
})



module.exports=router;