const {Router} = require('express')
const router = Router()

router.get('/registration', function (req, res) {
    res.render('registration')
})

router.post('/registration', async (req, res) => {
    res.redirect('/')
})

module.exports = router 

