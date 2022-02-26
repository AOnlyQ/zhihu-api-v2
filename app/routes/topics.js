const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const { find, findById, create, update, checkTopicExist, listTopicsFollowers } = require('../controllers/topics')
const { secret } = require('../config')
const jwt = require('koa-jwt')
// 认证中间件
const auth = jwt({ secret })

// 获取话题列表
router.get('/', find)
// 创建新话题
router.post('/', auth, create)
// 获取特定话题
router.get('/:id', findById)
// 修改特定话题
router.patch('/:id', auth, update)
// 获取当前话题下的关注者
router.get('/:id/followers', checkTopicExist, listTopicsFollowers)

module.exports = router