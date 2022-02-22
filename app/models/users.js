const mongoose = require('mongoose')
const { Schema, model } = mongoose
const userSchema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 0 }
})

// user代表集合，导出的是一个类
module.exports = model('user', userSchema)