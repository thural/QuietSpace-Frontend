const User = require("../models/userModel")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

module.exports.validateUser = (req, res, next) => {
  const errors = validationResult(req)
  req.user = new User({ username: req.body.username, password: req.body.password })
  if (!errors.isEmpty()) {
    return res.json({
      user: req.user,
      errors: errors.array()
    })
  } next()
}

module.exports.saveUser = async (req, res, next) => {
  try {
    const found_user = await User.findOne({ username: req.body.username })
    if (found_user) {
      return res.json( {
        user: req.user,
        errors: [{ msg: "User with same name already exists" }],
      })
    }
  } catch (err) { return next(err) }
  
  bcrypt.hash(req.user.password, 10, (err, hashedPassword) => {  
    if (err) return next(err)
    req.user.password = hashedPassword
    req.user.save(err => {
      if (err) return next(err)
      //res.redirect('/')
      return res.status(200).json(req.user)
    })
  })
}