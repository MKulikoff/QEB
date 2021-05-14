const {Router} = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const resetEmail = require('../emails/reset')
const keys = require('../keys')
const User = require('../models/user')
const router = Router()


const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))


router.get('/login',  async (req, res) => {
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

router.get('/reset', (req, res) => {
    res.render('reset', {
        title: 'Сброс пароля',
        error: req.flash('error')
    })
    
})

router.get('/password:token', async (req, res) => {
    if(!req.params.token) {
        return res.redirect('/login')
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.resetToken,
            resetTokenExp: {$gt: Date.now()}
        })

        if(!user) {
            res.redirect('/login')
        } else {
            res.render('/password', {
                title: 'Смена пароля',
                error: req.flash('error'),
                userId: user._id.toString(),
                token: req.params.token
            })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/password', async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.body.userId,
            resetToken: req.body.token,
            resetTokenExp: {$gt: Date.now()} 
        })

        if(user) {
            user.password = await bcrypt.hash(req.body.password, 10)
            user.resetToken = undefined
            user.resetTokenExp = undefined
            await user.save()
            res.redirect('/login')
        } else {
            res.redirect('/login')
            req.flash('loginError', 'Время жизни токена истекло')
        }
        
         
    } catch (error) {
        console.log(error)
    }
})

router.post('/reset',  (req, res) => {
    try {
       crypto.randomBytes(32, async (err, buffer) => {
            if(err) {
                req.flash('error', 'Не сработало')
                return res.redirect('/reset')
            } 

        const token = buffer.toString('hex')
        const candidate = await User.findOne({email: req.body.email})

        if(candidate) {
            candidate.resetToken = token
            candidate.resetTokenExp = Date.now() + 60 * 60 * 1000
            await candidate.save()
            await transporter.sendMail(resetEmail(candidate.email, token))
            res.redirect('/login')
        } else {
            req.flash('error', 'Пользователь с данным email не найден')
            return res.redirect('/reset')
        }
       }) 
    } catch (error) {
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
       
        const candidate = await User.findOne({ email })
        if (candidate) {
          const areSame = await bcrypt.compare(password, candidate.password)
          req.session.isAdministrator = candidate.isAdministrator
    
          if (areSame) {
            req.session.user = candidate
            req.session.isAuthenticated = true
            req.session.save(err => {
              if (err) {
                throw err
              } else {
                    res.redirect('/')
                }
            })} 
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

