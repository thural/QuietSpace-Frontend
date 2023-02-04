const Filter = require('bad-words')
const customFilter = new Filter({ placeHolder: '*' })
const dirty_words = require("../dirty_words")
const Chat = require("../models/chatModel")
// const User = require("../models/userModel")
customFilter.addWords(...dirty_words)

const checkInput = (value, { req }) => {
  if (customFilter.isProfane(value)) return false;
  const does_match = dirty_words.some(word => {
    const regex = new RegExp(`\\s${word}\\s|mother.+|sister.+`, 'i')
    return regex.test(value)
  })
  if (does_match) return false
  else return true
}

const { body, validationResult } = require("express-validator")

exports.load = (req, res, next) => {
	Chat.find({_id: req.user._id})
    .populate("_id", "username")
		.sort([["date", "descending"]])
		.exec((err, chatData) => {
			if (err) return next(err)
			res.status(200).json(chatData[0])
		})
}

exports.add_message = [

  // input validation
  body("text", "at least 1 characters required").isLength({ min: 1 }),
  body("text", "max 256 characters allowed").isLength({ max: 256 }),
  body("text").custom(checkInput).withMessage("Your message can not contain bad words"),

  // validation results
  (req, res, next) => {
    const errors = validationResult(req)
    req.message = { username: req.user.username, text: req.body.text }
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() })
    } next()
  },

  // saving to database
  async (req, res, next) => {

    try {

      const chatOfSender = await Chat.findOne({ "_id": req.user._id })
      const chatOfReceiver = await Chat.findOne({ "_id": req.params.contactID })

      var prevMessagedSender = undefined
      var prevMessagedReceiver = undefined
      var newSenderChat = undefined
      var newReceiverChat = undefined

      // for sender
      if (chatOfSender) {

        prevMessagedSender = chatOfSender.chat
          .some(contact => contact._id == req.params.contactID)

        if (prevMessagedSender) {
          //if the contact already been messaged previously

          chatOfSender.chat.map(contact => {
            if (contact._id == req.params.contactID) contact.messages.push(req.message)
            return contact
          })

        } else {
          //if the contact never been messaged previously
          chatOfSender.chat.push({
            _id: req.params.contactID,
            messages: [req.message]
          })
        }
      } else {
        //if there is no any message by the current user
        newSenderChat = new Chat({
          _id: req.user._id,
          chat: [
            {
              _id: req.params.contactID,
              messages: [req.message]
            }
          ]
        })
      }



      // for receiver
      if (chatOfReceiver) {

        prevMessagedReceiver = chatOfReceiver.chat
          .some(contact => contact._id == req.params.contactID)

        if (prevMessagedReceiver) {
          //if the contact already been messaged previously

          chatOfReceiver.chat.map(contact => {
            if (contact._id == req.user._id) contact.messages.push(req.message)
            return contact
          })
          
        } else {
          //if the contact never been messaged previously
          chatOfSender.chat.push({
            _id: req.user._id,
            messages: [req.message]
          })
        }
      } else {
        //if there is no any message by the current user
        newReceiverChat = new Chat({
          _id: req.params.contactID,
          chat: [
            {
              _id: req.user._id,
              messages: [req.message]
            }
          ]
        })
      }

      const forSender = chatOfSender ? chatOfSender : newSenderChat
      const forReceiver = chatOfReceiver ? chatOfReceiver : newReceiverChat


      forSender.save(err => {

        if (err) return next(err)

        forReceiver.save(err => {
          if (err) return next(err)
          console.log("saved message to the chat: ", forReceiver)
          return res.status(200).json(forReceiver)
        })

      })

    } catch (err) { return next(err) }
  }
]