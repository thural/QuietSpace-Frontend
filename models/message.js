const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const { DateTime } = require('luxon')

const MessageSchema = new Schema({
  username: { type: String, required: true, maxLength: 16 },
  message: { type: String, required: true, maxLength: 100 },
  date: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

MessageSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED)
})

const Message = mongoose.model("Message", MessageSchema)

module.exports = Message