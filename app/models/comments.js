const mongoose = require('mongoose')
const { Schema, model } = mongoose
const commentSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  commentator: { type: Schema.Types.ObjectId, ref: 'User', select: true },
  questionId: { type: String, select: true },
  answerId: { type: String, select: true },
  // 一级评论id
  rootCommentId: { type: String, select: true },
  // 一级评论的用户
  replyTo: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })
module.exports = model('Comment', commentSchema)
