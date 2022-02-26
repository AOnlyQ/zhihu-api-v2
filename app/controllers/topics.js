const Topic = require('../models/topics')
const User = require('../models/users')
class TopicsCtl {
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(+ctx.query.page, 1) - 1
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await Topic.find({ name: new RegExp(ctx.query.q) }).limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    // 如果没有fields,即fields为undeined,则下面的fields.split(";")方法会报错，故为其指定默认值为空字符串
    const { fields = '' } = ctx.query
    const selectFields = fields.split(";").filter(item => item).map(item => ' +' + item).join('')
    const topic = await Topic.findById(ctx.params.id).select(selectFields);
    if (!topic) ctx.throw(404, '话题不存在')
    ctx.body = topic
  }
  async create (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const { name } = ctx.request.body
    const repeatedTopic = await Topic.findOne({ name })
    if (repeatedTopic) ctx.throw(409, '话题已经存在')
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }
  async update (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false },
      introduction: { type: 'string', required: false }
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
    if (!topic) ctx.throw(404, '话题不存在')
    ctx.body = topic
  }
  // 获取该话题的关注者
  async listTopicsFollowers (ctx) {
    const users = await User.find({ followingTopics: ctx.params.id })
    ctx.body = users
  }
  async checkTopicExist (ctx, next) {
    const topic = await Topic.findById(ctx.params.id)
    if (!topic) ctx.throw(404, '话题不存在')
    await next()
  }
}
module.exports = new TopicsCtl()