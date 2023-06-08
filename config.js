const dotenv=require('dotenv');
dotenv.config();

module.exports={
      MONGO_URL:process.env.MONGO_URL||"mongodb://localhost/Clinic",
      JWT_SECRET:process.env.JWT_SECRET||"Clinic_Gordarz",
      SERVER_URL:process.env.SERVER_URL||"http://192.168.178.55:3000",
      NUM_ELEMENT_IN_PAGE:process.env.NUM_ELEMENT_IN_PAGE
}