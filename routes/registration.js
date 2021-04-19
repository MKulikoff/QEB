const {Router} = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../emails/registration')
const keys = require('../keys')
const router = Router()


const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/registration', function (req, res) {
    res.render('registration', {
        title: 'Регистрация',
        registrationError: req.flash('error')
    })
})


router.post('/registration', async (req, res) => {
    try {
        const {email, nickname, password} = req.body
        const candidate = await User.findOne({email})

        if(candidate) {
            req.flash('error', 'Пользователь с таким email уже существует.')
            res.redirect('/registration')
        } else {
            const hashPassword = await bcrypt.hash(password, 10)
            req.session.isAuthenticated = true
            const user = new User({
                email,
                nickname, 
                password: hashPassword
            })
            await user.save()
            res.redirect('/')
            await transporter.sendMail(regEmail(email))
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router 

