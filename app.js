var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var allowCors=require('./allowCors');
var path = require('path');
// to enable cors
const bcrypt = require('bcrypt');

var cors = require('cors');
var User = require('./models/users');
var usersRouter = require('./routes/users');
var doctorRouter = require('./routes/doctor');
var patientRouter = require('./routes/patient');
var appointmentRouter = require('./routes/appointment');
var searchRouter = require('./routes/search');
var settingsRouter=require('./routes/setting');

var app = express();


// const allowlist = ['http://localhost:3000', 'https://appointment-reservation-6etd.vercel.app']
// const corsOptions = {
//   origin: allowlist
// }

// app.use(cors(corsOptions));

app.use(cors());
// app.use(allowCors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// to create folder product_images in project's path
app.use(express.static(path.join(__dirname, 'doctor_images')))



// connecting with DB
var mongoos = require('mongoose');
const config = require('./config');
console.log(config.MONGO_URL);
mongoos.connect(config.MONGO_URL, { useNewUrlParser: true }).then(conRes => {
  User.find({}).then(result => {
    if (result.length < 1) {
      bcrypt.hash('admin', 10, (err, hash) => {
        if (err) {
          res.status(404).json({ message: err })
        }
        else {
          const newUser = new User({
            username: 'admin',
            password: hash
          });
          newUser.save().then(result => {
          }).catch(err => {
            res.status(404).json({ message: err.message })
          });
        }
      })
    }
  })
  console.log('connecting has been done successfully...');
}).catch(err => {
  console.log(err);

})
// ***************************

app.use(logger('dev'));
app.use('/', usersRouter);
app.use('/users', usersRouter);
app.use('/doctors', doctorRouter);
app.use('/patients', patientRouter);
app.use('/appointments', appointmentRouter);
app.use('/search', searchRouter);
app.use('/appsettings',settingsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {

  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;


  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message
  })
});

// For publish
// var port=process.env.PORT||5000

// var server=app.listen(port,function(){
//   console.log('Server is running')
// })
module.exports = app;
