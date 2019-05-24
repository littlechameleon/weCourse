const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.body.openId
  let courseId = ctx.request.body.courseId
  let content = ctx.request.body.content

  let message = {
      courseId: courseId,
      type: 0,
      direction: 0,
      student: openId,
      content: content,
      time: new Date(),
      state: 0,
    }

  await mysql('message').insert(message)

  ctx.state.data = {
    code: 0,
  }
} 