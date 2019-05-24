const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let isTeacher = ctx.request.query.isTeacher
  let openId = ctx.request.query.openId
  let courseId = ctx.request.query.courseId
  let targetId = ctx.request.query.targetId

  let course = await mysql('course').where('course_id', courseId)
  let privateMessage

  if (isTeacher == 0) {
    privateMessage = await mysql('message').where({ courseId: courseId, type: 1, student: openId, teacher: targetId }).orderBy('time', 'asc')
  } else {
    privateMessage = await mysql('message').join('student', 'student.open_id', '=', 'message.student').where({ 'message.courseId': courseId, 'message.type': 1, 'message.teacher': openId, 'student.course_id': courseId, 'message.student':targetId }).orderBy('time', 'asc')
  }

  ctx.state.data = {
    course: course[0],
    messageList: privateMessage,
    code: 0,
  }
} 