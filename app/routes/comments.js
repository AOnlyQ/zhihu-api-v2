const Router = require('koa-router')
const router = new Router({ prefix: '/questions/:questionId/answers/:answerId/comments' })

const { checkCommentExist, checkCommentator, find, findById, create, delete: del, update } = require('../controllers/comments')
const { secret } = require('../config')
const jwt = require('koa-jwt')
const auth = jwt({ secret })
// 
router.get('/', find)
router.get('/:id', checkCommentExist, findById)
router.post('/', auth, create)
router.patch('/:id', auth, checkCommentExist, checkCommentator, update)
router.delete('/:id', auth, checkCommentExist, checkCommentator, del)
module.exports = router