const {Router} = require('express')
const auth = require('../middleware/auth')
const Question = require('../models/question')
const admin = require('../middleware/admin')
const router = Router()

router.get('/editQuestion/:id', auth, admin, async (req, res) => {
    
    const question = await Question.findById(req.params.id)

    res.render('question-edit', {
        title: 'Редактировать вопрос',
        question
    })
    
})

router.post('/updateQuestion', auth, admin, async (req, res) => {
    const {id} = req.body
    delete req.body.id
    await Question.findByIdAndUpdate(id, req.body)
    res.redirect('/questions')
  })

router.post('/deleteQuestion', auth, admin, async (req, res) => {
    try {
        await Question.deleteOne({id: req.body.id})
        res.redirect('/questions')
      } catch (error) {
        console.log(error)
      }
})
module.exports = router 
