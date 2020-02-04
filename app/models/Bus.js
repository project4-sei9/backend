
const mongoose = require('mongoose')
const {studentsSchema} = require('./student')
const busSchema = new mongoose.Schema({
  bus_no: {
    type: Number,
    required: true,
    unique: true
  },
  status: {
    type: String
  },
  location:  {
    latitude: {
      type: String
    },
  longitude: {
    type: String
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