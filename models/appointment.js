const mongoose=require('mongoose');

const AppointmentSchema=mongoose.Schema({
      patient:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Patient',
            required:true
      },
      doctor:{
            // get type of category id
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            required:true
      },
      appointmentDate:{
            type:String,
            required:true
      },
      appointmentTime:{
            type:String,
            required:true
      }
})

module.exports=mongoose.model('Appointment',AppointmentSchema);