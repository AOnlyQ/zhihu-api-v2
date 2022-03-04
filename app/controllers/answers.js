const Answer = require('../models/answers')
class AnswersCtl {
  async checkAnswerExist (ctx, next) {
    const answer = await Answer.findById(ctx.params.id).select("+answerer +questionId")
    if (!answer) ctx.throw(404, '答案不存在')
    // 只有删改查答案才检查是否有questionId,赞和踩答案不检查
    if (ctx.params.questionId && answer.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此答案')
    ctx.state.answer = answer
    await next()
  }
  async checkAnswerer (ctx, next) {
    const { answer } = ctx.state
    if (answer.answerer.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()

  }
  async find (ctx) {
    const { per_page, page = 1 } = ctx.query
    const perPage = !per_page ? 10 : +per_page
    const skipPage = Math.max(page * 1, 1) - 1
    const q = new RegExp(ctx.query.q)
    ctx.body = await Answer.find({ content: q, questionId: ctx.params.questionId }).limit(perPage).skip(skipPage * perPage)
  }
  async findById (ctx) {
    const { field = '' } = ctx.query
    const selectFields = field.split(';').filter(item => item).map(item => ' +' + item).join('')
    const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
    if (!answer) { ctx.throw(404, '答案不存在') }
    ctx.body = answer
  }
  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const { questionId } = ctx.params
    const answerer = ctx.state.user._id
    const answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save()
    ctx.body = answer
  }
  async update (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    ctx.body = await Answer.findByIdAndUpdate(ctx.params.id, ctx.request.body, { new: true })
  }
  async delete (ctx) {
    await Answer.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}
module.exports = new AnswersCtl()