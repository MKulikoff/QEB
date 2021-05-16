const {Router} = require('express')
const auth = require('../middleware/auth')
const  Question = require('../models/question')
const admin = require('../middleware/admin')
const router = Router()

router.get('/addQuestion', auth, admin, async (req, res) => {
    res.render('addQuestion', {
        title: 'Добавить новый вопрос'
    })
    
})

router.post('/addQuestion', auth, admin, async (req, res) => {
    const question = new Question ({
        title: req.body.questionTitle,
        optionA: req.body.optionA,
        optionB: req.body.optionB,
        optionC: req.body.optionC,
        optionD: req.body.optionD,
        correctOption: req.body.correctOption
    })

    try {
        await question.save()
        res.redirect('/questions')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router 