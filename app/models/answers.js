const mongoose = require('mongoose')
const { Schema, model } = mongoose
const answersSchema = new Schema({
  __v: { type: Number, select: false },
  content: { type: String, required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
  questionId: { type: String, required: true, select: false },
  // 某答案总的点赞数
  voteCount: { type: Number, required: true, default: 0 }
})
module.exports = model("Answer", answersSchema)