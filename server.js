const express = require('express')
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

const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

const corsOptions = {
  origin: "*", 
  credentials: true,
  optionsSuccessStatus: 200 
}

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

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/chats', require('./routes/chatRoutes'))

app.get('/success', (req,res) => {
  res.send('Login success!')
})

app.get('/failure', (req,res) => {
  res.send('Login failed!')
})

const server = app.listen(5000, function () {
  console.log('server listening at', server.address())
})