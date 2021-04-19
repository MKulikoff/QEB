const keys = require('../keys')

module.exports = function(email) {
   return {  to: email, 
    from: 'laistiop@mail.ru',
    subject: 'Вы успешно зарегестрировались',
    html: 
    `<h1>Регистрация на QEB прошла успешно</h1>
    <p>Аккаунт с адресом ${email} создан</p>
    <hr/>
    <a href="${keys.MONGO_URI}">QEB</a>
    `
   }
}