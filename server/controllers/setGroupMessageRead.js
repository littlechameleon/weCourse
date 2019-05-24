const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let isTeacher = ctx.request.query.isTeacher
  let courseId = ctx.request.query.courseId

  let message = await mysql('message').where({ courseId: courseId, type: 0 }).orderBy('id', 'desc')


  if (isTeacher == 0) {
    await mysql('student').update({ groupState: message[0].id }).where({ course_id: courseId, open_id: openId })
  } else {
    await mysql('course').update({ groupState: message[0].id }).where({ course_id: courseId })
  }

  ctx.state.data = {
    code: 0,
  }
}

