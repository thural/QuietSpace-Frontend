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
	Chat.find({_id: senderID})
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

      var newSenderChat = undefined
      var newReceiverChat = undefined

      const senderID = req.user['_id'].toString()
      const receiverID = req.params['contactID']

      console.log("senderID: ", senderID)
      console.log("receiverID: ", receiverID)

      const senderChat = await Chat.findOne({ "_id": senderID })
      const receiverChat = await Chat.findOne({ "_id": receiverID })



      // if chat already exists for sender
      if (senderChat) {

        const receiverExists = senderChat.chat.some(contact => contact['_id'] == receiverID)

        console.log("receiverExists: ", receiverExists)

        if (receiverExists) {

          //if the contact already been messaged previously
          senderChat.chat.map(contact => {
            if (contact._id == receiverID) contact.messages.push(req.message)
            return contact
          })

        } else {

          //if the contact never been messaged previously
          senderChat.chat.push({
            _id: receiverID,
            messages: [req.message]
          })

        }
      } else {
        //if there is no any message by the current user
        newSenderChat = new Chat({
          _id: senderID,
          chat: [ { _id: receiverID, messages: [req.message] } ]
        })
      }


      // if chat already exists for receiver
      if (receiverChat) {

        const senderExists = receiverChat.chat.some(contact => contact['_id'] == senderID)

        console.log("senderExists: ", senderExists)

        if (senderExists) {
          //if the contact already been messaged previously

          receiverChat.chat.map(contact => {
            if (contact._id == senderID) contact.messages.push(req.message)
            return contact
          })

        } else {
          //if the contact never been messaged previously
          receiverChat.chat.push({
            _id: senderID,
            messages: [req.message]
          })
        }
      } else {
        //if there is no any message by the current user
        newReceiverChat = new Chat({
          _id: receiverID,
          chat: [ { _id: senderID, messages: [req.message] } ]
        })
      }


      const forSender = senderChat ? senderChat : newSenderChat
      const forReceiver = receiverChat ? receiverChat : newReceiverChat


      forSender.save(err => {

        if (err) return next(err)

        forReceiver.save(err => {
          if (err) return next(err)
          console.log("saved message to the chat: ", forReceiver.chat.messages)
          return res.status(200).json(forReceiver)
        })

      })

    } catch (err) { return next(err) }
  }
]