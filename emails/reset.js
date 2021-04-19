const keys = require('../keys')

module.exports = function(email, token) {
    return {  
        to: email, 
        from: 'laistiop@mail.ru',
        subject: 'Восстановление пароля',
        html: 
        `<h1>Восстановление вашего пароля на QEB</h1>
        <p>Для сброса пароля перейдите по ссылке</p>
        <a href="${keys.MONGO_URI}/password/${token}"</a>
        <hr/>
        <a href="${keys.MONGO_URI}">QEB</a>
        `
       }
}