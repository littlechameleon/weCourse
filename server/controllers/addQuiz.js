const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let openId = ctx.request.query.openId
  let score = ctx.request.query.score
  let time = new Date()
  let quiz = {
    time: time,
    courseId: courseId,
    openId: openId,
    score: score,
  }
  let result = await mysql('quiz').insert(quiz)

  ctx.state.data = {
    result: result,
    code: 0,
  }
}