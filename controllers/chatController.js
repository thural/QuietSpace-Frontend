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


exports.add_message = [
  body("text", "at least 1 characters required").isLength({ min: 1 }),
  body("text", "max 256 characters allowed").isLength({ max: 256 }),
  body("text").custom(checkInput).withMessage("Your comment can not contain bad words"),

  (req, res, next) => {
    const errors = validationResult(req)
    console.log('USER value inside validateMessage() : ', req.user)
    req.message = { user_id: req.user._id, text: req.body.text }
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() })
    } next()
  },

  async (req, res, next) => {
    try {

      const found_chat = await Chat.findOne({ "_id": req.user._id })
      const prevMessaged = undefined
      const chat = undefined


      if (found_chat) {

        prevMessaged = found_chat.chat
        .some(contact => contact.user_id == req.param.user_id)

        if (prevMessaged) {
          //if the contact already been messaged previously
          found_chat.chat.map(contact => {
            if (contact.user_id == req.params.sender_id) {
              contact.messages.push(req.message)
              return contact
            } else return contact
          })
        } else {
          //if the contact never been messaged previously
          found_chat.chat.push({
            user_id: req.param.user_id,
            messages: [req.message]
          })
        }

      } else {

        //if there is no any message by the current user
       chat = new Chat({
          user_id: req.user._id,
          chat: [
            {
              user_id: req.param.user_id,
              messages: [req.message]
            }
          ]
        })

      }

      const toBeSaved = prevMessaged ? found_chat : chat

      toBeSaved.save(err => {
        if (err) return next(err)
        console.log("saved message to the chat: ", toBeSaved)
        return res.status(200).json(toBeSaved)
      })

    } catch (err) { return next(err) }
  }
]