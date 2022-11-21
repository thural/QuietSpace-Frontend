const Message = require("../models/messageModel")
const { validationResult } = require("express-validator")

module.exports.validateMessage = (req, res, next) => {
  const errors = validationResult(req);
  console.log('VASLIDATE MESSAGE USER: ', req.user)
  req.message = new Message({ username: req.user.username, message: req.body.message })
  if (!errors.isEmpty()) {
    return res.json({errors: errors.array()})
  } next()
}

module.exports.saveMessage = async (req, res, next) => {
  try {
    const found_message = await Message.findOne({ username: req.user.username, message: req.body.message })
    if (found_message) res.json({msg:'message already exists'})
    else {
      req.message.save(err => {
        if (err) return next(err)
        res.status(200) // TODO: avoid page reaload
      })
    }
  } catch (err) { return next(err) }
}