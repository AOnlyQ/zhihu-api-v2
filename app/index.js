const Koa = require("koa")
const bodyparser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const app = new Koa();
const routing = require('./routes')

app.use(error({
  // 后置的修改返回格式,生产环境不暴露堆栈信息
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

app.use(bodyparser())
app.use(parameter(app))
routing(app)

app.listen(3000, () => {
  console.log('start server...');
})
