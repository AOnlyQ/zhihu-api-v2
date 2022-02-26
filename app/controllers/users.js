const { required } = require("nodemon/lib/config")
const jsonwebtoken = require('jsonwebtoken')
const { secret } = require('../config')
const User = require('../models/users')
class UsersCtl {
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
  // 检查登录用户是否为当前用户，授权
  async checkOwner (ctx, next) {
    // console.log("ctx.state.user", ctx.state.user)
    if (ctx.params.id !== ctx.state.user._id) ctx.throw('403', '没有权限')
    await next()
  }
  // 检查用户是否存在
  async checkUserExist (ctx, next) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }
  async find (ctx) {
    ctx.body = await User.find()
  }
  async findId (ctx) {
    // fields指定显示隐藏字段,默认值为空
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(item => item).map(f => ' +' + f).join('')
    // populateStr指定显示哪些引用话题字段
    const populateStr = fields.split(';').filter(item => item).map(item => {
      if (item === 'employments') return 'employments.company employments.job';
      if (item === 'educations') return 'educations.school educations.major';
      return item;
    }).join(' ');
    const user = await User.findById(ctx.params.id).select(selectFields)
      .populate(populateStr)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async create (ctx) {
    // 创建前的字段校验
    ctx.verifyParams({
      username: { type: 'string', required: true },
      password: { type: 'string', required: true }
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
      username: { type: 'string', required: false },
      password: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false }, // 用户头像
      gender: { type: 'string', required: false },
      headline: { type: 'string', required: false },
      locations: { type: 'array', itemType: 'string', required: false },
      business: { type: 'string', required: false },
      employments: { type: 'array', itemType: 'object', required: false },
      educations: { type: 'array', itemType: 'object', required: false }
    })
    // { new: true } 返回更新后的数据
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async deleteById (ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.status = 204 //没有内容，但是成功了
  }
  // 获取关注列表
  async listFollowing (ctx) {
    const user = await User.findById(ctx.params.id).select('+following').populate("following")
    if (!user) { ctx.throw(404) }
    ctx.body = user.following
  }
  // 获取粉丝
  async listFollowers (ctx) {
    const users = await User.find({ following: ctx.params.id }); // 查找following包含自己id的用户
    ctx.body = users
  }
  // 关注某人
  async follow (ctx) {
    const me = await User.findById(ctx.state.user._id).select('+following')
    // 关注的例表里是否有该人
    if (!me.following.map(id => id.toString()).includes(ctx.params.id)) {
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
  // 取消关注某人
  async unfollow (ctx) {
    const me = await User.findById(ctx.state.user._id).select("+following")
    const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.following.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }

}
module.exports = new UsersCtl()