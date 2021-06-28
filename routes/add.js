const {Router} = require('express')
const auth = require('../middleware/auth')
const Card = require('../models/card')
const admin = require('../middleware/admin')
const router = Router()

router.get('/add', auth, admin, async (req, res) => {
    res.render('add', {
        title: 'Добавить тему',
        user: req.user.toObject()
    })
    
})

router.post('/add', auth, admin, async (req, res) => {
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