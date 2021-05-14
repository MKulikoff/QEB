const {Router} = require('express')
const auth = require('../middleware/auth')
const Card = require('../models/card')
const admin = require('../middleware/admin')
const router = Router()



router.get('/theme-edit/:id', auth, admin, async (req, res) => {
    const card = await Card.findById(req.params.id)
    res.render('theme-edit', {
        title: 'Edit Theme',
        card
    })
})

router.post('/theme-edit', auth, admin, async (req, res) => {
    try {
        const cards = await Card.findById(req.body.id)
        const toChange = {
            text: req.body.text
        }

        Object.assign(cards, toChange)
        await cards.save()
        res.redirect('/card')
    } catch (error) {
        console.log(error)
    }
})



router.post('/theme', auth, admin, async (req, res) => {
    try {
        const cards = await Card.findById(req.body.id)
        
        const toChange = {}
        
        if(req.file) {
            console.log(req.file)
            toChange.question = req.file.path
        }

        Object.assign(cards, toChange)
        await cards.save()
        res.redirect('/card')
    } catch (error) {
        console.log(error)
    }
})



module.exports = router 