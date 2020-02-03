const mongoose = require('mongoose')
const {studentsSchema} = require('./student')


const busSchema = new mongoose.Schema({
  bus_no: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String,
    // required: true
  },
  location:  { 
                latitude: {
                          type: String,
                          // required: true
                           },
                longitude: {
                           type: String,
                            // required: true
                          }
  },
  students: [studentsSchema],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
    }
})

const Bus = mongoose.model('Bus', busSchema)

module.exports = Bus
