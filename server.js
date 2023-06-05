const express = require('express')
// const errorHandler = require('./middleware/errorHandler')
const cookieParser = require("cookie-parser")
const session = require("express-session")
const passport = require("passport")
const logger = require('morgan')
const path = require('path')
const User = require("./models/userModel")
const passportLocal = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require("body-parser")
const app = express()
dotenv.config()

// const my_logger = (request, response, next) => {
// 	console.log(
// 		"URL: ", request.url,
// 		"Method: ", request.method,
// 		"Body: ", request.body,
// 		new Date().getMilliseconds()
// 	);
// 	next()
// }

const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

const corsOptions = {
  origin: "*", // <-- location of the react app were connecting to
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors(corsOptions))
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"))
app.use(passport.initialize())
app.use(passport.session())
//require("./passportConfig")(passport)
//app.use(errorHandler)

passport.use(
  new passportLocal((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err)
      if (!user) return done(null, false, { message: "Incorrect username" })
      bcrypt.compare(password, user.password, (err, res) => {
        if (!res) return done(null, false, { message: "Incorrect password" })
        else return done(null, user)
      })
    })
  })
)
passport.serializeUser((user, done) => { done(null, user.id) })
passport.deserializeUser((id, done) => { User.findById(id, (err, user) => { done(err, user)}) })

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger('dev'))

//app.use(my_logger)

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/chats', require('./routes/chatRoutes'))
app.all('*', (request, response) => { response.status(404).send('Error 404, Page not found') })

// const server = require('http').Server(app)
// const io = require('socket.io')(server)
// app.listen(5000)


const server = app.listen(5000, function () {
  console.log('server listening at', server.address())
})

// const io = require('socket.io')(server)

// io.on('connection', socket => {
//   //console.log(socket.id)
//   socket.on('custom-event', (str, num, arr) => {
//     console.log('message from custom event triggered on App component load:')
//     console.log("string: ", str, "number: ", num, "array: ", arr)
//   })
// })