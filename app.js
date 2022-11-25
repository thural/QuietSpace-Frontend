const express = require('express')
const errorHandler = require('./middleware/errorHandler')
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

const my_logger = (request, response, next) => {
  console.log(
    "URL: ", request.url,
    "Method: ", request.method,
    "Body: ", request.body,
    new Date().getMilliseconds()
  );
  next()
}

const mongoose = require('mongoose')
const mongoDB = process.env.MONGODB_URI || process.env.DEV_DB_URL
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

const corsOptions = {
  origin: "http://localhost:5000", // <-- location of the react app were connecting to
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
passport.deserializeUser((id, done) => { User.findById(id, (err, user) => { done(err, user) }) })

// app.post("/log-in", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err) throw err;
//     if (!user) res.json({msg:"User does not exist"});
//     else {
//       req.logIn(user, (err) => {
//         if (err) throw err;
//         res.status(200).json(req.user);
//         console.log(req.user);
//       });
//     }
//   })(req, res, next);
// });

// app.post("/register", (req, res) => {
//   User.findOne({ username: req.body.username }, async (err, doc) => {
//     if (err) throw err;
//     if (doc) res.send("User Already Exists");
//     if (!doc) {
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);

//       const newUser = new User({
//         username: req.body.username,
//         password: hashedPassword,
//       });
//       await newUser.save();
//       res.send("User Created");
//     }
//   })
// });


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger('dev'))

//app.use(my_logger)

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/messages', require('./routes/messageRoutes'))

app.all('*', (request, response) => { response.status(404).send('Error 404, Page not found') })

app.listen(5000)