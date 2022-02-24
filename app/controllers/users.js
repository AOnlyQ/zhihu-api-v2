const { required } = require("nodemon/lib/config")
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const User = require('../models/users')
class UserCtrl {
  async login (ctx) {
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名或密码不正确')
    }
    const { _id, username } = user;
    const token = jsonwebtoken.sign({ _id, username }, secret, { expiresIn: '1h' })
    // ctx.body = { _id, username, token }
    ctx.body = { token }


  }
  async checkOwner (ctx, next) {
    console.log("ctx.state.user", ctx.state.user)
    if (ctx.params.id !== ctx.state.user._id) ctx.throw('403', '没有权限')
    await next()
  }
  async find (ctx) {
    ctx.body = await User.find()
  }
  async findId (ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async create (ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const { username } = ctx.request.body
    const repeatedUser = await User.findOne({ username })
    if (repeatedUser) {
      ctx.throw(409, '用户名已经存在')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async update (ctx) {
    ctx.verifyParams({
      username: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      }
    })
  
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async deleteById (ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.status = 204 //没有内容，但是成功了
  }

}
module.exports = new UserCtrl()