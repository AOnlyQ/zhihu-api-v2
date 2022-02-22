const Router = require('koa-router')
const router = new Router({ prefix: '/user' })
const { find, findId, create, update, delete: del } = require('../controllers/users')

const db = [{ name: "李雷" }]
// 获取用户列表
router.get('/', find);


// 获取特定用户
router.get("/:id", findId)

// 增加用户
router.post('/', create)

// 修改特定用户
router.put('/:id', update)

// 删除用户
router.delete('/:id', del)
module.exports = router