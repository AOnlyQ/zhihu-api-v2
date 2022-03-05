const Comment = require('../models/comments')
class CommentsCtl {
  async checkCommentExist (ctx, next) {
    const comment = await Comment.findById(ctx.params.id).select('+commentator')
    if (!comment) ctx.throw(404, '评价不存在')
    if (ctx.params.questionId && comment.questionId !== ctx.params.questionId) ctx.throw(404, '该问题下没有此评论')
    if (ctx.params.answerId && comment.answerId !== ctx.params.answerId) ctx.throw(404, '该答案下没有此评论')
    ctx.state.comment = comment
    await next()
  }
  async checkCommentator (ctx, next) {
    const { comment } = ctx.state
    if (comment.commentator.toString() !== ctx.state.user._id) ctx.throw(403, '没有权限')
    await next()
  }
  // 
  async find (ctx) {
    // 获取某问题下某答案的所有评价
    const { per_page, page = 1 } = ctx.query
    const perPage = !per_page ? 10 : +per_page
    const skipPage = Math.max(page * 1, 1) - 1
    const q = new RegExp(ctx.query.q)
    const { questionId, answerId } = ctx.params
    // 新增rootCommentId，有该Id证明是二级评论，
    const { rootCommentId } = ctx.query
    ctx.body = await Comment.find({ content: q, questionId, answerId, rootCommentId }).limit(perPage).skip(perPage * skipPage).populate('commentator replyTo')
  }
  // 获取某问题下某答案的特定评价
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(";").filter(item => item).map(item => " +" + item).join('')
    const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
    if (!comment) ctx.throw(404, '评论不存在')
    ctx.body = comment
  }
  async create (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      rootCommentId: { type: 'string', required: false },
      replyTo: { type: 'string', required: false }
    })
    const commentator = ctx.state.user._id
    const { questionId, answerId } = ctx.params
    const comment = await new Comment({ ...ctx.request.body, commentator, questionId, answerId }).save()
    ctx.body = comment
  }
  async update (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: false }
    })
    const { content } = ctx.request.body
    ctx.body = await Comment.findByIdAndUpdate(ctx.params.id, { content }, { new: true })
  }
  async delete (ctx) {
    await Comment.findByIdAndRemove(ctx.params.id)
    ctx.status = 204
  }
}
module.exports = new CommentsCtl()