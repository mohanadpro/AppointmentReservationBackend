const mongoose=require('mongoose');

const PatientSchema=mongoose.Schema({
      name:{
            type:String,
            required:true
      },
      doctor:{
            // get type of category id
            type:mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            required:true
      },
      insuranceNumber:{
            type:String,
            required:false
      },
      fileNumber:{
            type:Number,
            required:false
      },
      mobileNumber:{
            type:Number,
            required:false
      },
      email:{
            type:String,
            required:false            
      }
})

module.exports=mongoose.model('Patient',PatientSchema);