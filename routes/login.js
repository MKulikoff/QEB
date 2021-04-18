const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const router = Router()


router.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Войти',
        loginError: req.flash('error')
    })
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    }); 
    
})


router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if(candidate) {
            const match = await bcrypt.compare(password, candidate.password)

            if(match) {
                req.session.user = candidate
                req.session.isAuthenticated = true
                req.session.save((err => {
                if(err) {
                    throw err
                } else {
                    res.redirect('/')
                }
            }))} 
            else {
                req.flash('error', 'Неверный пароль')
                res.redirect('/login')
            }
        } else {
            req.flash('error', 'Пользователя с таким email не существует')
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error)
    }

  })


module.exports = router 

