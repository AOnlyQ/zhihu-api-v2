const Koa = require("koa")
const bodyparser = require('koa-bodyparser')
const app = new Koa();
const routing = require('./routes')

app.use(bodyparser())
routing(app)

app.listen(3000, () => {
  console.log('start server...');
})
