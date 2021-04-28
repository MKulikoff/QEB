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
  }
})

module.exports = model('User', userSchema)