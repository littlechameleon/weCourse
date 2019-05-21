const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let openId = ctx.request.query.openId
  let quizList = await mysql('quiz').where({ courseId: courseId, openId: openId }).orderBy('time', 'desc')

  ctx.state.data = {
    quizList: quizList,
    code: 0,
  }
}