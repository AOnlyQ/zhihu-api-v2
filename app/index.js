const Koa = require("koa")
const koaBody = require('koa-body')
const koaStatic = require('koa-static');
const path = require("path")
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const app = new Koa();
const routing = require('./routes')
const { connectionLocal ,connectionStr} = require('./config.js')

mongoose.connect(connectionStr, { useNewUrlParser: true }, () => console.log('MongoDB 连接成功'))
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, 'public')))
app.use(error({
  // 后置的修改返回格式,生产环境不暴露堆栈信息
  postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}))

app.use(koaBody({
  multipart: true, // 启用文件
  formidable: {
    uploadDir: path.join(__dirname, 'public/uploads'),
    keepExtensions: true
  }
}))
app.use(parameter(app))
routing(app)

app.listen(3000, () => {
  console.log('start server at port 3000');
})
