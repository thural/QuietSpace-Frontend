const mongoose = require("mongoose")
const Schema = mongoose.Schema

const MessageSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", requied: true },
    text: { type: String, required: true, maxLength: 128 },
    date: { type: Date, default: Date.now },
    //reactions: [{ user: { type: Schema.Types.ObjectId, ref: "User" }, emoji: { type: String } }]
  }
)

const ContactSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "User", requied: true },
    messages: [MessageSchema]
  }
)

const ChatSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, ref: "User", requied: true },
  date: { type: Date, default: Date.now },
  chat: [ContactSchema]
})

const Chat = mongoose.model("Chat", ChatSchema)

module.exports = Chat