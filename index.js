//Imports
const csurf = require('csurf')
const flash = require('connect-flash')
const express = require('express') // импорт Express, библиотека, модуль
const socketIO = require('socket.io')
// const multer = require('multer')
const Handlebars = require('handlebars')
const bodyParser = require('body-parser')
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
const editQuestionRouters = require('./routes/editQuestions')
const quizRouters = require('./routes/quiz')
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
app.use(bodyParser.urlencoded({ extended: false }))
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
app.use(editQuestionRouters)
app.use(quizRouters)

app.use(notfoundMiddleware)

const PORT = process.env.PORT || 5000

const handleListening = async () => {
  try {
    await mongoose.connect(keys.MONGO_URI)
  } catch (error) {
    console.log(error)
  }
  console.log(`Server started on ${PORT}`)
}

const server = app.listen(PORT, handleListening)

const io = socketIO(server)

let sockets = []
let finalPoints = []


io.on('connection', (socket) => {

  io.emit('peopleOnline', 'User connected')

  //Number of connected users

  io.emit('numberOfConnected', socket.adapter.sids.size);

   //Get user nickname 
   socket.on('getNickname', (getNickname) => {
    socket.nickname = getNickname
    sockets.push({id: socket.id, points: 0, nickname: getNickname})
    io.emit('stateUpdate', sockets)
  })

  const addPoints = id => {
    sockets = sockets.map(socket => {
      if(socket.id === id) {
        socket.points++
      } 
        return socket
      })
    io.emit('stateUpdate', sockets)
  }

  //Get user score
  socket.on('scoreUpdate', (socketID) => {
    addPoints(socketID)
  })

  const selectWinner = id => {
    sockets = sockets.map(socket => {
      if(socket.id === id) {
        finalPoints.push(socket)
      }
      return socket
    })
  }

  //Select winner 

  socket.on('sumPoints', () => {
    io.emit('stateUpdate', sockets)
  })

  //User disconnect
  socket.on('disconnect', () => {
    sockets = sockets.filter(aSocket => aSocket.id !== socket.id)
    io.emit('stateUpdate', sockets)
  });  
});




