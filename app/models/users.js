const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: { type: Number, select: false },
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String }, // 用户头像
  gender: { type: String, enum: ['male', 'female'], default: 'male', required: true },
  headline: { type: String },
  locations: { type: [{ type: String }], select: false },
  business: { type: String, select: false },
  employments: {
    type: [{
      company: { type: String },
      job: { type: String }
    }],
    select: false
  },
  educations: {
    type: [{
      school: { type: String },
      major: { type: String },
      diploma: { type: Number, enum: [1, 2, 3, 4, 5,] },
      entrance_year: { type: Number },
      graduation_year: { type: Number }
    }],
    select: false
  }

})

// user代表集合，导出的是一个类
module.exports = model('user', userSchema)