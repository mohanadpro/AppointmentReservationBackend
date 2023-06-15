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


app.use(cors());
app.use(allowCors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// to create folder product_images in project's path
app.use(express.static(path.join(__dirname, 'doctor_images')))


// enable cors on Vercel


const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = (req, res) => {
  const d = new Date()
  res.end(d.toString())
}

module.exports = allowCors(handler)



// connecting with DB
var mongoos = require('mongoose');
const config = require('./config');

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
