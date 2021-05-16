//Imports
const csurf = require('csurf')
const flash = require('connect-flash');
const express = require('express') // импорт Express, библиотека, модуль
// const multer = require('multer')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars') //Установка HTML пакета
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const fs = require('fs')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const keys = require('./keys')
//Routes
const homeRoutes = require('./routes/home')
const loginRoutes = require('./routes/login')
const profileRoutes = require('./routes/profile')
const registrationRoutes = require('./routes/registration')
const cardRoutes = require('./routes/card')
const addRouters = require('./routes/add')
const themeRouters = require('./routes/theme')
const addQuestionRouters = require('./routes/addQuestions')
const questionsRouters = require('./routes/questions')
//Middleware
const varMiddleware =  require('./middleware/variables')
const notfoundMiddleware = require('./middleware/notfound')
const profileFileMiddleware = require('./middleware/profileFile')
const userMiddleware = require('./middleware/user')
//Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');
//Sessions
const store = new MongoDBStore({
    uri: keys.MONGO_URI,
    collection: 'sessions'
  });

  store.on('error', function(error) {
    console.log(error);
  });

app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  }))

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/questions', express.static(path.join(__dirname, 'questions')))
app.use(express.urlencoded({extended: true}))


app.use(profileFileMiddleware.single('avatar'))


app.use(csurf())
app.use(varMiddleware)
app.use(userMiddleware)
app.use(flash())


app.use(homeRoutes)
app.use(loginRoutes)
app.use(profileRoutes)
app.use(registrationRoutes)
app.use(cardRoutes)
app.use(addRouters)
app.use(themeRouters)
app.use(addQuestionRouters)
app.use(questionsRouters)

app.use(notfoundMiddleware)

const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await mongoose.connect(keys.MONGO_URI)
        app.listen(PORT, () => 
            console.log(`Server started on ${PORT}`)) 
    } catch (error) {
        console.log(error)
    }
}

start() 