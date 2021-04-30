const {Router} = require('express')
const auth = require('../middleware/auth')
const Card = require('../models/card')
const router = Router()

router.get('/add', auth, async (req, res) => {
    res.render('add', {
        title: 'Добавить тему'
    })
    
})

router.post('/add', auth, async (req, res) => {
    const card = new Card ({
        title: req.body.title,
        description: req.body.description,
        img: req.body.img
    })

    try {
        await card.save()
        res.redirect('/card')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router 