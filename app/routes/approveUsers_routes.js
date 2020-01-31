const express = require('express');
//import router into express
const router = express.Router();
//import car model
const User = require('../models/user');
const customErrors = require('../../lib/custom_errors')
// we'll use this function to send 404 when non-existant document is requested
const requireOwnership = customErrors.requireOwnership
// import passport
const passport = require('passport');
const requireToken = passport.authenticate('bearer',{session:false})

//get all users
router.get('/users',requireToken,(req,res,next) => {
    const userId = req.user._id
    User.find()
    .then(users => {
        res.status(200).json({users:users});
    })
    .catch(next)
})

module.exports = router;