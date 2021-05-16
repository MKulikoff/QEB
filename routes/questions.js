const {Router} = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Question = require('../models/question')
const router = Router()

router.get('/questions', auth, admin, async (req, res) => {
    const questions = await Question.find()
    res.render('questions', {
        title: 'Cписок вопросов',
        questions
    })
    
})

module.exports = router