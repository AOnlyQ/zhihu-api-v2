const jwt = require('koa-jwt')
const Router = require('koa-router')
const { secret } = require('../config')
const router = new Router({ prefix: '/questions/:questionId/answers' })
const { checkAnswerExist, checkAnswerer, find, findById, create, delete: del, update,

} = require('../controllers/answers')


const auth = jwt({ secret })

// 获取某问题的所有答案
router.get('/', find)
// 获取特定答案
router.get('/:id', checkAnswerExist, findById)
// 新增答案
router.post('/', auth, create)
// 修改答案
router.patch('/:id', auth, checkAnswerExist, checkAnswerer, update)
// 
router.delete('/:id', auth, checkAnswerExist, checkAnswerer, del)
module.exports = router