const {Router} = require('express')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const Card = require('../models/card')
const router = Router()


router.get('/card', auth, async (req, res) => {
    const cards = await Card.find()
    res.render('card', {
        title: 'Выберите тему',
        cards
    })
    
})

router.get('/theme/:id', auth, async (req, res) => {
    try { 
            const cards = await Card.findById(req.params.id)
            res.render('theme', {
            title: `${cards.title}`,
            cards
        })
        
    } catch (error) {
        console.log(error)
    }
   
})


module.exports = router 
