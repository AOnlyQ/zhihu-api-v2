const { required } = require("nodemon/lib/config")
const User = require('../models/users')
class UserCtrl {
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
      name: {
        type: 'string',
        required: true
      },
      age: {
        type: 'number',
        required: false
      }
    })
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  async update (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      age: {
        type: 'number',
        required: false
      }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  delete (ctx) {
    if (ctx.params.id >= db.length) {
      ctx.throw(412, '先决条件失败：id大于数组条件长度')
    }
    const user = User.findByIdAndRemove(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.status = 204 //没有内容，但是成功了
  }
}
module.exports = new UserCtrl()