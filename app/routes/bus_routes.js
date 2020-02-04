//import express
const express = require('express');
//import router into express
const router = express.Router();
//import car model
const Bus = require('../models/Bus');
// const Student = require('../models/student')
const User = require('../models/user')
const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const requireOwnership = customErrors.requireOwnership
// import passport
const passport = require('passport');
const requireToken = passport.authenticate('bearer',{session:false})

//Index 
//Index - get all buses 
router.get('/buses/driver', requireToken,(req,res,next)=>{
    const userId = req.user._id;
    Bus.findOne({"owner":userId})
     .then(bus => {
          res.status(200).json({bus:bus});
      })
    .catch(next)
    })

//Index 


//create : 
//POST - /bus
// router.post('/buses/new',requireToken,(req,res,next) => {
//     const userId = req.user._id;
//     console.log(req.params)
//     newBus = req.body.bus
//     const buss = new Bus(newBus)
//     buss.owner = userId
//     buss.save()
//      .then(bus => {
//        res.status(201).send({bus:bus})
//      })
//     .catch(next)
// })

//Index 
//Index - get all buses 
router.get('/buses',(req,res,next)=>{
   // const userId = req.user._id;
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
router.post('/buses',(req,res,next) => {
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
router.patch('/buses/:busId/update',(req,res,next) => {
   // console.log("________________________")
    const busId = req.params.busId;
    const updatedBus = req.body.bus
    Bus.findById(busId)
    .then((bus) => {
        // requireOwnership(req,bus)
        return bus.update(updatedBus)
    })
    .then(() =>  res.sendStatus(204))
    .catch(next)
})


router.patch('/buses/:busId', async (req,res,next) => {
    try {
        const busId = req.params.busId;
        const updatedBus = req.body.data.bus
        const studentId = req.body.data.studentId
        const bus = await Bus.findById(busId)
        await bus.update(updatedBus)
        // const copyStudents = [...bus.students]
        // const students2 = copyStudents.map(student => {
        //     student.address = req.body.data.bus.location
        //     return student
        // })
        // bus.students = students2
        await bus.save()
        const owner = await User.findOne({"students._id": studentId})
        const studentIndex = await owner.students.findIndex(student => String(student._id) === studentId)
        const students = [...owner.students]
        students[studentIndex].address = req.body.data.bus.location
        owner.students = students
        await owner.save()
        res.send(bus.students)
    }
    catch(error){
        next(error)
    }
 })

// router.patch('/buses/:busId/student/:studentId',requireToken,(req,res,next) => {
//     const busId = req.params.busId
//        const studentId = req.params.studentId
//        const updatedStudent = req.body.bus
//        Bus.findById(busId)
//        .then((bus)=> {
//            let index = bus.students.findIndex(x => x._id == studentId)
//            bus.students[index].address = updatedStudent
//            return bus
//        })
//        .then((bus) => bus.save())
//       // .then((bus) => res.redirect(`/users/${busId}/tweets/${tweetid}`))
//        .catch(err => console.log(err))
//    })

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