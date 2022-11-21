const { validateUser, saveUser } = require("../middleware/userMiddleware")
const Filter = require('bad-words')
const customFilter = new Filter({ placeHolder: '*' })
const { body } = require("express-validator")
const passport = require("passport")

exports.login_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/"
})

exports.logout_get = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
}

exports.user_get = (req, res) => {
  if (!user) {
    res.status(400)
    throw new Error('user has not logged in')
  }
  res.json({ user: req.user })
}

exports.create_post = [

  body("username", "username required")
    .trim()
    .isLength({ min: 3, max: 12 })
    .withMessage('user name must be at least 3 and max 12 chars long')
    .escape(),

  body("username")
    .custom((value, { req }) => {
      if (customFilter.isProfane(value)) return false
      else return true
    }).withMessage("User name can not contain bad words"),

  body("password", "password required")
    .isLength({ min: 6, max: 16 })
    .withMessage('password must be at least 6 and max 16 chars long')
    .escape(),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password fields can not be empty.")
    .custom((value, { req }) => {
      if (value === req.body.password) return true
      else return false;
    }).withMessage("Passwords does not match."),

  validateUser,
  saveUser
]