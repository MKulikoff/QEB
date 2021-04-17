const {Router} = require('express')
const auth = require('../middleware/auth')
const router = Router()

router.get('/card', auth, async (req, res) => {
    res.render('card', {
        title: 'Выберите тему'
    })
    
})

module.exports = router 
