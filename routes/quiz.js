const {Router} = require('express')
const auth = require('../middleware/auth')
const Question = require('../models/question')
const User = require('../models/user')
const router = Router()


router.get('/quiz', auth, async (req, res) => {
    res.render('quiz', {
        title: 'Выберите тему',
        user: req.user.toObject()
    })

})

router.get('/quizData', async(req, res) => {
    const questions = await Question.find()
    const randomQuestion = []
    const numberOfQuestions = questions.length
    
    while(randomQuestion.length < 5) {
         randomQuestion.push(questions[Math.round(Math.random() * (numberOfQuestions - 1))])  
    }
    res.status(200).json(randomQuestion);
})

router.post('/sendAnswer', auth, async (req, res) => {
    const candidateAnswer = req.body.answer
    const correctAnswer = await Question.findById(req.body.id)
    
        if(correctAnswer.correctOption == candidateAnswer) {

        } else {
            res.redirect('/card')
        }
})

module.exports = router
