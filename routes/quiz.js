const {Router} = require('express')
const auth = require('../middleware/auth')
const Question = require('../models/question')
const router = Router()


router.get('/quiz', auth, async (req, res) => {
    const questions = await Question.find()   

    res.render('quiz', {
        title: 'Выберите тему',
    })

})

router.get('/quizData', async(req, res) => {
    const questions = await Question.find()
    const numberOfQuestions = questions.length
    const question = questions[Math.round(Math.random() * (numberOfQuestions - 1))]
    res.status(200).json(question);
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
