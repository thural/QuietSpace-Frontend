const Message = require("../models/message")
const { validationResult } = require("express-validator")

module.exports.validateMessage = (req, res, next) => {
  const errors = validationResult(req);
  req.message = new Message({ username: req.user.username, message: req.body.message })
  if (!errors.isEmpty()) {
    return res.json({errors: errors.array()})
  } next()
}

module.exports.saveMessage = async (req, res, next) => {
  try {
    const found_message = await Message.findOne({ username: req.user.username, message: req.body.message })
    if (found_message) res.redirect('/')
    else {
      req.message.save(err => {
        if (err) return next(err)
        res.redirect('/')
      })
    }
  } catch (err) { return next(err) }
}