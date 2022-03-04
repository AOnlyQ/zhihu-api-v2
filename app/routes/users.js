const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { checkUserExist, checkOwner, login,
  find, findId, create, update, deleteById,
  listFollowing, listFollowers, follow, unfollow,
  followTopic, unfollowTopic, listFollowingTopics, listQuestions,
  listLikingAnswers, listDisLikingAnswers, likeAnswer, dislikeANswer, unlikeAnswer, undislikeAnswer,
  listCollectAnswers, collectAnswer, uncollectAnswer
} = require('../controllers/users')
const { checkTopicExist } = require('../controllers/topics')
const { checkAnswerExist } = require('../controllers/answers')
// const jsonwebtoken = require("jsonwebtoken")
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
router.post("/login", login)
router.get('/', find); // 获取用户列表
router.get("/:id", findId) // 获取特定用户
// 增加用户
router.post('/', create)
// 修改特定用户
router.patch('/:id', auth, checkOwner, update)
// 删除用户
router.delete('/:id', auth, checkOwner, deleteById)
// 获取关注列表
router.get('/:id/following', listFollowing)
// 获取粉丝
router.get('/:id/followers', listFollowers)
// 关注某人
router.put('/following/:id', auth, checkUserExist, follow)
// 取消关注某人
router.put('/unfollowing/:id', auth, checkUserExist, unfollow)

// 关注话题
router.put('/followingTopic/:id', auth, checkTopicExist, followTopic)
// 取消关注话题
router.put('/unfollowingTopic/:id', auth, checkTopicExist, unfollowTopic)
// 获取特定用户关注的话题列表
router.get('/:id/listFollowingTopics', listFollowingTopics)
// 获取某用户提的问题列表
router.get('/:id/questions', checkUserExist, listQuestions)
// 获取某用户喜欢的答案列表，id为用户id
router.get('/:id/likingAnswers', listLikingAnswers)
// 点赞某答案,id为答案id
router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)
// 取消点赞答案
router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer)
// 获取某用户踩的答案列表，id为用户id
router.get('/:id/dislikingAnswers', listDisLikingAnswers)
router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeANswer, unlikeAnswer)
router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer)
// 收藏答案列表
router.get('/:id/collectAnswers', listCollectAnswers)
router.put('/collectAnswers/:id', auth, checkAnswerExist, collectAnswer)
router.delete('/collectAnswers/:id', auth, checkAnswerExist, uncollectAnswer)

module.exports = router