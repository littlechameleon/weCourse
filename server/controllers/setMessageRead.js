const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let isTeacher = ctx.request.query.isTeacher
  let courseId = ctx.request.query.courseId
  let targetId = ctx.request.query.targetId

  if (isTeacher == 0) {
    await mysql('message').update({ state: 1 }).where({ courseId: courseId, teacher: targetId, student: openId, type: 1, direction: 1 })
  } else {
    await mysql('message').update({ state: 1 }).where({ courseId: courseId, teacher: openId, student: targetId, type: 1, direction: 0 })
  }

  ctx.state.data = {
    code: 0,
  }
} 