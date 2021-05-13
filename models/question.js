const {Schema, model} = require('mongoose')

const questionSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    optionA: {
        type: String,
        required: true
    },
    optionB: {
        type: String, 
        required: true
    },
    optionC: {
        type: String, 
        required: true
    },
    optionD: {
        type: String, 
        required: true
    },
    correctOption: {
        type: String, 
        required: true
    },

})

module.exports = model('Question', questionSchema)
