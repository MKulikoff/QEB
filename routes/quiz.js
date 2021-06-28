const {Router} = require('express')
const auth = require('../middleware/auth')
const Question = require('../models/question')
const User = require('../models/user')
const router = Router()

let title; 

router.get('/quiz/:title', auth, async (req, res) => {
    title = req.params.title
    res.render('quiz', {
        title: 'Выберите тему',
        user: req.user.toObject(),
        title
    })

})

router.get('/quizData', async(req, res) => {
    const questions = await Question.find({theme: title})
    const randomQuestion = []
    const numberOfQuestions = questions.length
    
    while(randomQuestion.length < 5) {
         randomQuestion.push(questions[Math.round(Math.random() * (numberOfQuestions - 1))])  
    }
    res.status(200).json(randomQuestion);
})


module.exports = router
