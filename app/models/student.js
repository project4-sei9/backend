const mongoose = require('mongoose')
const studentsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    date: Date,
    address:
        { latitude: {type: String
                    },
          longitude: {type: String}
        }
  },
  {
    timestamps: true
  })
  const Student = mongoose.model('Student', studentsSchema)
  module.exports = {Student, studentsSchema}