const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema({
  __v: { type: Number, select: false },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false }
})

// user代表集合，导出的是一个类
module.exports = model('user', userSchema)