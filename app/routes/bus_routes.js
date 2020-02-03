//import express
const express = require('express');
//import router into express
const router = express.Router();
//import car model
const Bus = require('../models/Bus');
// const Student = require('../models/student')
// const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const requireOwnership = customErrors.requireOwnership
// import passport
const passport = require('passport');
const requireToken = passport.authenticate('bearer',{session:false})

//Index 
//Index - get all buses 
router.get('/buses', requireToken,(req,res,next)=>{
    const userId = req.user._id;
   Bus.find({})
    .then(buses => {
         res.status(200).json({buses:buses});
     })
   .catch(next)
   })
//Index 
//create : 
//POST - /bus
//  5e37df9fe9d25756ff143cf3
router.post('/buses',requireToken,(req,res,next) => {
    const newBus = new Bus(req.body)
     newBus.driver = req.user._id
     newBus.save()
     .then(bus => {
         res.status(201).json({bus:bus})
     })
    .catch(next)
})
  

//SHOW 
// GET - /buses/:id
router.get('/buses/:busId',requireToken,(req,res,next) => {
    const busId = req.params.busId;
    Bus.findById(busId)
    .then(bus =>{
        requireOwnership(req,bus)
        res.status(200).json({bus:bus})
    })
    .catch(next)
})

//UPDATE
// PUT -> Large data
//PATCH -> small data
//PATCH - /cars/:id
router.patch('/buses/:busId',requireToken,(req,res,next) => {
   // console.log("________________________")
    const busId = req.params.busId;
    const updatedBus = req.body.bus
    Bus.findById(busId)
    .then( (bus) => {
        requireOwnership(req,bus)
        return bus.update(updatedBus)
    } )
    .then(() =>  res.sendStatus(204))
    .catch(next)
})

//Destroy
// delete - /bus/:id
router.delete('/buses/:busId',requireToken,(req,res,next) => {
    const busId = req.params.busId;
    Bus.findById(busId)
    .then((bus) => {
        requireOwnership(req,bus)
        return bus.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})




  

module.exports = router