const mongoose = require('mongoose')
const {studentsSchema} = require('./student')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  driver: {//if staff(Admin) or Driver
    type: Boolean,
    //required: true
  },
  guardian: { //is he an apprived as an driver/admin or not .. 
    type: Boolean,
    //required: true
  },
  students:[studentsSchema],
  token: String
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})
userSchema.virtual('examples', {
  ref: 'Example',
  localField: '_id',
  foreignField: 'owner'
});
module.exports = mongoose.model('User', userSchema)