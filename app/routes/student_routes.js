const express = require('express');
//import router into express
const router = express.Router();
//import models
const User = require('../models/user');
const {Student} = require('../models/student');
const Bus = require ('../models/Bus')

const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const requireOwnership = customErrors.requireOwnership
const requireApproval = customErrors.requireApproval
// import passport
const passport = require('passport');
const requireToken = passport.authenticate('bearer',{session:false})



//get all  students
router.get('/students',requireToken,(req,res) => { 
    res.send({
        students: req.user.students
    })
 })

//SHOW student
// GET - /user/:id
router.get('/students/:id',requireToken,(req,res) => { 
    const id = req.params.id
    const student = req.user.students.find(student => String(student._id) === id)
    res.send({
        student
    })
})
//create student 
// Bus.update(
//     {_id: req.body.bus},
//     {$push: {students: newStudent}}
// )
// .then(
//     updateInfo => req.send({student: newStudent})
// )
// .catch(
//     err => res.status(400).send(err)
// )
router.post('/students',requireToken,(req,res) => { 
    const newStudent = new Student(req.body.student)
    req.user.students = req.user.students.concat(newStudent)
    req.user.save()
    .then(
        user => {
            Bus.findById(req.body.bus)
            .then(
                bus => {
                    bus.students = bus.students.concat(newStudent)
                    bus.save()
                    .then(
                        bus => res.status(201).send(bus)
                        
                    )
                    .then( () => res.send(bus))
                    .catch(
                        err => res.status(400).send(err)
                    )
                }
            )
            .catch(
                err => res.status(400).send(err)
            )
        }
    )
    .catch(
        err => res.status(400).send(err)
    )
})

//update a student
// router.put('/users/:userid/students/:studentId',requireToken,(req,res,next) => { 
//     const userid= req.params.userid
//    const studentId = req.params.studentId
//    const updatedStudent = req.body
//    User.findById(userid)
//    .then((user)=>{
//     let index= user.students.findIndex(x => x._id ==studentId)
//     user.students[index].name= updatedStudent.name
//     user.students[index].busNo= updatedStudent.busNo
//     return user.save()
//    })
//    .then(()=> res.redirect(`/users/:${userid}/students/${studentId}`))
//    .catch(next)
// })
//delete a student
// router.delete('/students/:id',requireToken,(req,res) => { 
//     const studentIndex = req.user.students.findIndex(student => String(student._id) === req.params.id)
//     const student = req.user.students[studentIndex]
//     req.user.students.splice(studentIndex, 1)
//     user.save()
//     .then(
//         user => {
//             Bus.findOne({_id:data._id, "students._id": student})
//             .then(
//                 bus => {
//                     const studentIndex = bus.students.findIndex(student => String(student._id) === req.params.id)
//                     bus.students.splice(studentIndex, 1)
//                     bus.save()
//                     .then(
//                         bus => res.send("Student was deleted")
//                     )
//                     .catch(
//                         err => res.status(400).send(err)
//                     )
//                 }
//             )
//             .catch(
//                 err => res.status(400).send(err)
//             )
//         }
//     )
//     .catch(
//         err => res.status(400).send(err)
//     )

//     // Bus.findOne({_id:data._id, "students._id": student})
// })

router.delete('/students/:id',requireToken, async(req,res) => { 
    try{
        const update = await User.update(
            {
                _id: req.user._id
            },
            {
                $pull: {students: { _id : req.params.id } }
            }
        )
        const bus = await Bus.update({"students._id": req.params.id}, {
            $pull: {students: { _id : req.params.id } }
        })
        res.send("Student was deleted")
    }
    catch(error){
        err => res.status(400).send(err)
    }
})


module.exports = router;
