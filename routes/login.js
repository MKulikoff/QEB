const {Router} = require('express')
const router = Router()

router.get('/login', (req, res) => {
    res.render('login')
})

// router.post('/login', async (req, res) => {
//     req.session.isAuth = true
//     res.redirect('/')
// })

module.exports = router 

