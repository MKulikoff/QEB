const {body} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email').isEmail().withMessage('Некорректный Email адрес').custom( async (value, {req}) => {
        try {
           const user = await User.findOne({ email: value })
           if (user) {
               return Promise.reject('Пользователь с таким email уже существует.')
           }
        } catch (error) {
          console.log(error)  
        }
    }).normalizeEmail(),
    body('nickname').custom( async (value, {req}) => {
        try {
            const user = await User.findOne({ nickname: value})
            if(user) {
                return Promise.reject('Данный никнейм уже занят')
        }
            } catch (error) {
                console.log(error)
    }
    }).trim(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({min: 5, max: 36}).isAlphanumeric(),
    body('rpassword').custom((value, {req}) => {
        if(value !== req.body.password) {
            throw new Error('Пароли не совпадают')
        }

        return true
    }),
    body('nickname', 'Ваш никнейм должен быть не менее 5 и не более 10 символов').isLength({min: 5, max: 10}).isAlphanumeric().trim()
]