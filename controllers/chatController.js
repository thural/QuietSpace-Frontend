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
    .populate({ 
      path: 'chat',
      model: 'User'
    })
    .populate({ 
      path: 'chat',
      populate: {
        path: 'messages',
        model: 'User'
      } 
   })
		.sort([["date", "descending"]])
		.exec((err, chatData) => {
			if (err) return next(err)
			// if (req.user) {
			// 	const postIndex = contacts.findIndex(elem => elem.username === req.user.username)
			// 	if (postIndex !== -1) {
			// 		const userPost = contacts[postIndex]
			// 		contacts.splice(postIndex, 1)
			// 		contacts.unshift(userPost)
			// 	}
			// }
			res.status(200).json(chatData[0])
		})
}

exports.add_message = [
  body("text", "at least 1 characters required").isLength({ min: 1 }),
  body("text", "max 256 characters allowed").isLength({ max: 256 }),
  body("text").custom(checkInput).withMessage("Your message can not contain bad words"),

  (req, res, next) => {
    const errors = validationResult(req)
    console.log('USER value inside validateMessage() : ', req.user)
    req.message = { user_id: req.user._id, text: req.body.text }
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() })
    } next()
  },

  async (req, res, next) => {
    console.log("user_id from params: ", req.params.contact_id)
    try {
      const found_chat_sender = await Chat.findOne({ "_id": req.user._id })
      const found_chat_receiver = await Chat.findOne({ "_id": req.params.contact_id })
      var prevMessagedSender = undefined
      var prevMessagedReceiver = undefined
      var senderChat = undefined
      var receiverChat = undefined

      // for sender
      if (found_chat_sender) {
        prevMessagedSender = found_chat_sender.chat
          .some(contact => contact._id == req.params.contact_id)
        if (prevMessagedSender) {
          //if the contact already been messaged previously
          found_chat_sender.chat.map(contact => {
            if (contact._id == req.params.contact_id) {
              contact.messages.push(req.message)
              return contact
            } else return contact
          })
        } else {
          //if the contact never been messaged previously
          found_chat_sender.chat.push({
            _id: req.params.contact_id,
            messages: [req.message]
          })
        }
      } else {
        //if there is no any message by the current user
        senderChat = new Chat({
          _id: req.user._id,
          chat: [
            {
              _id: req.params.contact_id,
              messages: [req.message]
            }
          ]
        })
      }

      // for receiver
      if (found_chat_receiver) {
        prevMessagedReceiver = found_chat_receiver.chat
          .some(contact => contact._id == req.user._id)
        if (prevMessagedReceiver) {
          //if the contact already been messaged previously
          found_chat_receiver.chat.map(contact => {
            if (contact._id == req.user._id) {
              contact.messages.push(req.message)
              return contact
            } else return contact
          })
        } else {
          //if the contact never been messaged previously
          found_chat_sender.chat.push({
            _id: req.user._id,
            messages: [req.message]
          })
        }
      } else {
        //if there is no any message by the current user
        receiverChat = new Chat({
          _id: req.params.contact_id,
          chat: [
            {
              _id: req.user._id,
              messages: [req.message]
            }
          ]
        })
      }

      const toBeSavedSender = found_chat_sender ? found_chat_sender : senderChat
      const toBeSavedReceiver = found_chat_receiver ? found_chat_receiver : receiverChat


      toBeSavedSender.save(err => {
        if (err) return next(err)

        toBeSavedReceiver.save(err => {
          if (err) return next(err)
          console.log("saved message to the chat: ", toBeSavedReceiver)
          return res.status(200).json(toBeSavedReceiver)
        })

      })

    } catch (err) { return next(err) }
  }
]