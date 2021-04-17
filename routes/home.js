const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    res.render('home', {
        title: 'Welcome to QEB',
    })
})

module.exports = router