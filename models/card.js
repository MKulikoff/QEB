const {Schema, model} = require('mongoose')

const cardSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img: {
        type: String, 
        required: true
    },
    text: String
})

cardSchema.method('toClient', function() {
    const card = this.toObject()
  
    card.id = card._id
    delete card._id
  
    return card
  })

module.exports = model('Card', cardSchema)