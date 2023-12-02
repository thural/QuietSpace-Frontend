const Chat = require("../models/chatModel")
const { body, validationResult } = require("express-validator")




exports.load = (req, res, next) => {
  const senderID = req.user['_id'].toString()
  Chat.find({_id: senderID})
    .populate("_id", "username")
    .sort([["date", "descending"]])
    .exec((err, chatData) => {
      if (err) return next(err)
      res.status(200).json(chatData[0])
    })
}

exports.add_message = [
  body("text", "at least 1 characters required").isLength({ min: 1 }),
  body("text", "max 256 characters allowed").isLength({ max: 256 }),

  (req, res, next) => {
    const errors = validationResult(req)
    req.message = { username: req.user.username, text: req.body.text }
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() })
    } next()
  },
  
  
  async (req, res, next) => {
    const senderID = req.user['_id'].toString()
    const receiverID = req.params.contactID

    try {
      var newSenderChat = undefined
      var newReceiverChat = undefined

      const senderChat = await Chat.findOne({ "_id": senderID })
      const receiverChat = await Chat.findOne({ "_id": receiverID })

      
      if (senderChat) {
        const receiverExists = senderChat.chat.some(contact => contact['_id'] == receiverID)
        if (receiverExists) {
          
          senderChat.chat.map(contact => {
            if (contact._id == receiverID) contact.messages.push(req.message)
            return contact
          })
        } else {
          
          senderChat.chat.push({
            _id: receiverID,
            messages: [req.message]
          })
        }
      } else {
        
        newSenderChat = new Chat({
          _id: senderID,
          chat: [ { _id: receiverID, messages: [req.message] } ]
        })
      }

      
      if (receiverChat) {
        const senderExists = receiverChat.chat.some(contact => contact['_id'] == senderID)

        if (senderExists) {
          
          receiverChat.chat.map(contact => {
            if (contact._id == senderID) contact.messages.push(req.message)
            return contact
          })
        } else {
          
          receiverChat.chat.push({
            _id: senderID,
            messages: [req.message]
          })
        }
      } else {
        
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