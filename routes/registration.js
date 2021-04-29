const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {validationResult} = require('express-validator/check')
const User = require('../models/user')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const regEmail = require('../emails/registration')
const keys = require('../keys')
const {registerValidators} = require('../utils/validators')
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


router.post('/registration', registerValidators, async (req, res) => {
    try {
        const {email, nickname, password, isAdmin} = req.body
    
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg)
            return res.status(422).redirect('/registration')
        }
            const hashPassword = await bcrypt.hash(password, 10)
            req.session.isAuthenticated = true
            const user = new User({
                email,
                nickname, 
                password: hashPassword,
                isAdministrator
            })
            await user.save()
            res.redirect('/')
            await transporter.sendMail(regEmail(email))
        }
     catch (error) {
        console.log(error)
         }
})

module.exports = router 

