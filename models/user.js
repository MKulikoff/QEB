const {Schema, model} = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date, 

  password: {
    type: String,
    required: true, 
  },
  avatarUrl: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: String, 
  age: Number, 
  raiting: {
    type: Number,
    default: 0
  },
  isAdministrator: {
    type: Boolean, 
    value: false
  }
})

module.exports = model('User', userSchema)