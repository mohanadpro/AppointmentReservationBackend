const express=require('express');
const router=express.Router();
const AppSettingsReservation=require('../models/setting');

router.post('/',(req,res)=>{
   
    AppSettingsReservation.find({}).then(appsettings=>{
        if(appsettings.length>0)
        {
            let body={
                startHour:req.body.startHour,
                endHour:req.body.endHour,
                hasBreak:req.body.hasBreak,
                howManyPatientInHour:req.body.howManyPatientInHour,
                whichHour:req.body.whichHour,
                howMuch:req.body.howMuch
            }
            AppSettingsReservation.findByIdAndUpdate({_id:appsettings[0]._id},{$set:body})
           .then(updatedRes=>{
            res.status(200).json({message:'Settings has been updated succesfully '})
           })
        }
        else
        {
            let setting=new AppSettingsReservation({
                startHour:req.body.startHour,
                endHour:req.body.endHour,
                howManyPatientInHour:req.body.howManyPatientInHour,
                hasBreak:req.body.hasBreak,
                whichHour:req.body.whichHour,
                howMuch:req.body.howMuch
            })
            setting.save().then(result=>{
                res.status(200).json({message:'Settings has been saved successfully'})
            })
            .catch(err=>{
                res.status(404).json({message:err})
            })
        }
    })

})

router.get('/',(req,res)=>{
    AppSettingsReservation.find({}).then(settings=>{
            res.status(200).json({settings:settings})
        })
        .catch(err=>{
            res.status(404).json({err:err})
        })
})


module.exports=router;