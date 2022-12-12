const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatSchema = new Schema({
  _id: { type: String, required: true },
  date: { type: Date, default: Date.now },
  chat: [
    {
      username: { type: String, required: true },
      messages: [
        {
          sender_id: { type: String, required: true },
          text: { type: String, required: true, maxLength: 100 },
          date: { type: Date, default: Date.now },
          reactions: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, emoji: { type: String } }]
        }
      ],
    }
  ]
})

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = Chat