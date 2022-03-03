const Question = require('../models/questions')

class QuestionsCtl {
  async find (ctx) {
    const { per_page, page = 1 } = ctx.query
    // 不存在时即没传(undefined)或者传空 将perPage设置为10
    const perPage = !per_page ? 10 : +per_page
    const skipPage = Math.max(page * 1, 1) - 1
    const q = new RegExp(ctx.query.q)
    ctx.body = await Question.find({ $or: [{ title: q }, { description: q }] }).limit(perPage).skip(skipPage * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(item => item).map(item => ' +' + item).join('')
    const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
    if (!question) {
      ctx.throw(404, '问题不存在')
    }
    ctx.body = question
  }
  async checkQuestionExist (ctx, next) {
    const question = await Question.findById(ctx.params.id).select('+questioner')
    if (!question) ctx.throw(404, '问题不存在')
    // 在修改问题前,需要先检查问题是否存在,也要调一次findById,故将其保存至ctx.state.question ,
    // 后面则只需要ctx.state.question.update() ,而不需要findByIdAndUpdate()
    ctx.state.question = question
    await next()
  }
  async checkQuestioner (ctx, next) {
    const { question } = ctx.state
    if (question.questioner.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
  async create (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: true },
      description: { type: 'string', required: false }
    })
    const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
    ctx.body = question
  }
  async update (ctx) {
    ctx.verifyParams({
      title: { type: 'string', required: false },
      description: { type: 'string', required: false }
    })
    ctx.state.question = await Question.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
    // 视频用下面这种方法,但有种缺陷,update无法设置返回新更改后的值,默认返回的是原始值
    // await ctx.state.question.update(ctx.request.body, { new: true }) 


    ctx.body = ctx.state.question
  }
  async delete (ctx) {
    await ctx.state.question.remove(ctx.params.id)
    ctx.status = 204
  }
  // 

}
module.exports = new QuestionsCtl()