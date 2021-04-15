//Imports
const express = require('express') // импорт Express, библиотека, модуль
const exphbs = require('express-handlebars') //Установка HTML пакета
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const session = require('express-session')
//Routes
const loginRoutes = require('./routes/login')
const registrationRoutes = require('./routes/registration')

app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('home');
})

app.use(loginRoutes)
app.use(registrationRoutes)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

//Sessions

app.use(session({
    secret: 'some secret value',
    resave: false, 
    saveUninitialized: false
}))

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://Mikhail:Hu5-Jd5-3zy-GU7@cluster0.8ldyi.mongodb.net/QEB?retryWrites=true&w=majority`)
        app.listen(PORT, () => 
            console.log(`Server started on ${PORT}`)) 
    } catch (error) {
        console.log(error)
    }
}

start() 