const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { find, findId, create, update, deleteById, login, checkOwner } = require('../controllers/users')

const jsonwebtoken = require("jsonwebtoken")
const jwt = require("koa-jwt")

const { secret } = require('../config')


// 自定义认证中间件
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header;
//   // 容错，没token得用户默认为空字符串，否则下面replace报语法错误
//   const token = authorization.replace('Bearer ', ''); // 根据上面截图，可以看到需要对value进行处理
//   try {
//     // 验证token有没有被篡改过
//     console.log(token)
//     const user = jsonwebtoken.verify(token, secret); // 不记得的往前看第四节
//     ctx.state.user = user; // 约定俗成，ctx.state通常用来放一些用户信息，一般就是放这里，也是没有为什么
//     console.log("ctx.state.user", ctx.state.user)
//   } catch (err) {
//     console.log(err)
//     ctx.throw(401, err.message);
//   }
//   console.log("testend")

//   // 执行后面的中间件
//   await next();
// }
const auth = jwt({ secret })


// 用户登录
router.post("/login",  login)

// 获取用户列表
router.get('/', find);


// 获取特定用户
router.get("/:id", findId)

// 增加用户
router.post('/', create)

// 修改特定用户
router.patch('/:id', auth, checkOwner, update)

// 删除用户
router.delete('/:id', auth, checkOwner, deleteById)
module.exports = router