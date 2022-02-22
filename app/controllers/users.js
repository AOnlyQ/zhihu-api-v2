const { required } = require("nodemon/lib/config")

const db = [{ name: '李雷' }, { name: "张三" }]
class UserCtrl {
  find (ctx) {
    a.b = 3
    ctx.body = db
  }
  findId (ctx) {
    if (+ctx.params.id >= db.length) {
      ctx.throw(412, '先决条件失败：id大于数组条件长度')
    }
    ctx.body = db[+ctx.params.id]
  }
  create (ctx) {
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
    db.push(ctx.request.body)
    ctx.body = ctx.request.body
  }
  update (ctx) {
    if (ctx.params.id >= db.length) {
      ctx.throw(412, '先决条件失败：id大于数组条件长度')
    }
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

    db[+ctx.params.id] = ctx.request.body
    ctx.body = ctx.request.body
  }
  delete (ctx) {
    if (ctx.params.id >= db.length) {
      ctx.throw(412, '先决条件失败：id大于数组条件长度')
    }
    db.splice(+ctx.params.id, 1)
    ctx.status = 204 //没有内容，但是成功了
  }
}
module.exports = new UserCtrl()