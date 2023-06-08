var express = require('express');
var router = express.Router();
var User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const config=require('../config');
const util = require('util');
const jwtVerifyAsync = util.promisify(jwt.verify);

/* GET users listing. */
router.get('/',(req,res)=>{
  User.find({typeOfUser:{'$ne':'Normal'}})
  .then(users=>{
  res.status(200).json({
    users:users
  })
  })
  .catch(err=>{res.status(404).json({message:err})})
})


router.get('/all',(req,res)=>{
  User.find()
  .then(users=>{
  res.status(200).json({
    users:users
  })
  })
  .catch(err=>{res.status(404).json({message:err})})
})



router.get('/getUserByName/:search',(req,res)=>{

  User.find({$and:[{ username:req.params.search ,$or:[{typeOfUser:'Chef'},{typeOfUser:'Waiter'}]}]})
  .then(users=>{
  res.status(200).json({
    users:users
  })
  })
  .catch(err=>{
    console.log(err);
    res.status(404).json({message:err})})
})




router.delete('/',(req,res)=>{
  User.deleteMany({}).then(result=>{
        res.status(200).json({message:'Users has been deleted successfully'});
  })
  .catch(err=>{
        res.status(404).json({message:err.message});
  })
})

router.post('/signup', (req, res) => {
  User.find({ username: req.body.username }).then(result => {
    if (result.length < 1) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(404).json({
              message:err
          })
        }
        else {
          const newUser = new User({
            username: req.body.username,
            password: hash,
            typeOfUser:'Normal',
            userPoints:0
          });
          newUser.save().then(result => {
            res.status(200).json({
              message: 'User has been saved successfully...'
            })
          }).catch(err => {
            res.status(404).json({
              message: err.message
            })
          });
        }
      })
    }
    else {
      res.status(404).json({
        message: "User " + req.body.username + " is already found"
      })
    }
  }).catch(err => {
    res.status(404).json({
      message: err.message
    })
  });
})

router.post('/checkToken',(req,res)=>{  

    const token=req.body.token;
    try {
          jwt.verify(token,config.JWT_SECRET,function(err,decoded){
            if(err)
            {
              console.log(err.message);
              res.status(408).json({message:'User is not authorized'})
            }
            else
            {
              res.status(200).json({message:'Authorized'});
            }
          })
    } catch (err) {
      throw new Error(err)
    }
})



router.post('/createUserAccount', (req, res) => {

  User.find({ username: req.body.username }).then(result => {
    if (result.length < 1) {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          res.status(404).json({message:err})}
        else {
          const newUser = new User({
            username: req.body.username,
            password: hash});
            newUser.save().then(result => {
            res.status(200).json({message: 'User has been saved successfully...'})
          }).catch(err => {
            res.status(404).json({message: err.message})});}})
    }
    else {
      res.status(404).json({
        message: "User " + req.body.username + " is already found"})}})
        .catch(err => {
    res.status(404).json({message: err.message})});})




router.post('/adminLogin',(req,res)=>{
  User.find({username:req.body.username})
  .then(users=>{
    if(users.length>=1)
    {
      bcrypt.compare(req.body.password,users[0].password)
      .then(result=>{
        if(result)
        {
          const user=users[0];
          const token=jwt.sign({user},config.JWT_SECRET,{
          expiresIn:"540m"
        });
        res.status(200)
        .json({user:{token:token,username:user.username,typeOfUser:user.typeOfUser,id:user._id,userPoints:user.userPoints}});
        }
        else
        res.status(404).json({message:'Password is wrong'})
      }).catch(err=>res.status(404).json({message:err.message}))
    }
    else
    {
      res.status(404).json({
        message:'User is not found'
      })
    }
  })
  .catch(err => {
    res.status(404).json({
      message: err.message
    })
  })
})


router.patch('/updateuser/:id',(req,res)=>{
  bcrypt.hash(req.body.password,10).then(
    hash=>{
      updatedUser={
        username:req.body.username,
        password:hash
      }
      User.findByIdAndUpdate({_id:req.params.id},{$set:updatedUser})
      .then(result=>{
          res.status(204).json({message:'User has been updated successfully...'})
        })
      .catch(err=>{
        res.status(404).json({
          message:err
        })}).catch(err=>{
    res.status(404).json({
      message:err.message
    })
  })
})});

router.get('/deleteUser/:id',(req,res)=>{

      User.findByIdAndDelete({_id:req.params.id}).then(result=>{
        res.status(200).json({message:'User has been deleted successfully...'})
        })
        .catch(err=>{
          res.status(404).json({
            message:err.message
          })
        })
})


module.exports = router;
