const mongoose=require('mongoose');

const DoctorSchema=mongoose.Schema({
      name:{
            type:String,
            required:true
      },
      image:{
            type:String,
            required:false
      }
})

module.exports=mongoose.model('Doctor',DoctorSchema)