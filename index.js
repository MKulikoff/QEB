//Imports
const csurf = require('csurf')
const flash = require('connect-flash');
const express = require('express') // импорт Express, библиотека, модуль
const exphbs = require('express-handlebars') //Установка HTML пакета
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const keys = require('./keys')
//Routes
const homeRoutes = require('./routes/home')
const loginRoutes = require('./routes/login')
const registrationRoutes = require('./routes/registration')
const cardRoutes = require('./routes/card')
//Middleware
const varMiddleware = require('./middleware/variables')

//Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
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
app.use(express.urlencoded({extended: true}))

app.use(csurf())
app.use(flash())
app.use(varMiddleware)

app.use(homeRoutes)
app.use(loginRoutes)
app.use(registrationRoutes)
app.use(cardRoutes)


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