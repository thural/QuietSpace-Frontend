const mongoose = require("mongoose")
const { Schema } = require("mongoose")
const { DateTime } = require('luxon')

const PostSchema = new Schema({
  username: { type: String, required: true, maxLength: 16 },
  text: { type: String, required: true, maxLength: 100 },
  date: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

PostSchema.virtual("date_formatted").get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED)
})

const Post = mongoose.model("Post", PostSchema)

module.exports = Post