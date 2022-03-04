const mongoose = require('mongoose')
const { Schema, model } = mongoose
const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: { type: Schema.Types.ObjectId, select: true },
  questionId: { type: String, select: true },
  answerId: { type: String, select: true }
})
module.exports = model('Comment', commentSchema)
