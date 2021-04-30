const {Router} = require('express')
const auth = require('../middleware/auth')
const Card = require('../models/card')
const router = Router()


router.get('/card', auth, async (req, res) => {
    const cards = await Card.find()
    res.render('card', {
        title: 'Выберите тему',
        cards
    })
    
})

router.post('/card', auth, async (req, res) => {
    
})



module.exports = router 
