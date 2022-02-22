const db = [{ name: '李雷' }, { name: "张三" }]
class UserCtrl {
  find (ctx) {
    ctx.body = db
  }
  findId (ctx) {
    ctx.body = db[+ctx.params.id]
  }
  create (ctx) {
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  update (ctx) {
    db[+ctx.params.id] = ctx.request.body
    ctx.body = ctx.request.body
  }
  delete (ctx) {
    db.splice(+ctx.params.id, 1)
    ctx.status = 204 //没有内容，但是成功了
  }
}
module.exports = new UserCtrl()