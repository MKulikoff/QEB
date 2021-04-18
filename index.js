//Imports
// const csurf = require('csurf')
const flash = require('connect-flash');
const express = require('express') // импорт Express, библиотека, модуль
const exphbs = require('express-handlebars') //Установка HTML пакета
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
//Routes
const homeRoutes = require('./routes/home')
const loginRoutes = require('./routes/login')
const registrationRoutes = require('./routes/registration')
const cardRoutes = require('./routes/card')
//Middleware
const varMiddleware = require('./middleware/variables')
//MongoDB
const URI = `mongodb+srv://Mikhail:Hu5-Jd5-3zy-GU7@cluster0.8ldyi.mongodb.net/QEB?retryWrites=true&w=majority`
//Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs');
//Sessions
const store = new MongoDBStore({
    uri: URI,
    collection: 'sessions'
  });

  store.on('error', function(error) {
    console.log(error);
  });

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store
  }))

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))

// app.use(csurf())
app.use(flash())
app.use(varMiddleware)

app.use(homeRoutes)
app.use(loginRoutes)
app.use(registrationRoutes)
app.use(cardRoutes)


const PORT = process.env.PORT || 5000

const start = async () => {
    try {
        await mongoose.connect(URI)
        app.listen(PORT, () => 
            console.log(`Server started on ${PORT}`)) 
    } catch (error) {
        console.log(error)
    }
}

start() 