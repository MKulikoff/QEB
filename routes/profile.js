const {Router} = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router = Router()

router.get('/profile', auth, async (req, res) => {
    res.render('profile', {
        title: 'Выберите тему',
        user: req.user.toObject()
    })
    
})

router.post('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        const toChange = {
            name: req.body.name
        }
        
        if(req.file) {
            toChange.avatarUrl = req.file.path
        }

        Object.assign(user, toChange)
        await user.save()
        res.redirect('/profile')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router 