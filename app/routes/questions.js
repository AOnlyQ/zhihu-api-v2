const jwt = require('koa-jwt')
const Router = require('koa-router')
const { secret } = require('../config')
const router = new Router({ prefix: '/questions' })
const { find, findById, delete: del, create, update, checkQuestionExist, checkQuestioner } = require('../controllers/questions')
const auth = jwt({ secret })
// 获取问题列表
router.get('/', find)
// 获取特定问题
router.get('/:id', checkQuestionExist, findById)
// 增加问题
router.post('/', auth, create)
// 修改问题
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
// 删除问题
router.delete("/:id", auth, checkQuestionExist, checkQuestioner, del)

module.exports = router