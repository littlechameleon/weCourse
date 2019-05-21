const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let isTeacher = ctx.request.query.isTeacher
  let openId = ctx.request.query.openId

  let course, courseId
  if(isTeacher == 0){
    course = await mysql('course').join('student', 'student.course_id', '=', 'course.course_id').where('student.open_id', openId)
  }else{
    course = await mysql('course').where('teacher_id', openId)
  }

  let groupMessage = [], privateMessage = []

  for(let index = 0; index<course.length; index++){
    let sortedMessage = {}, private, group
    group = await mysql('message').where({ courseId: course[index].course_id, type: 0 }).orderBy('time', 'desc')
    groupMessage.push(group)
    if(isTeacher == 0){
      private = await mysql('message').where({ courseId: course[index].course_id, type: 1, student: openId }).orderBy('time', 'desc')
      sortedMessage[course[index].teacher_id] = private
    }else{
      private = await mysql('message').join('student', 'student.open_id', '=', 'message.student').where({ 'message.courseId': course[index].course_id, 'message.type': 1, 'message.teacher': openId, 'student.course_id': course[index].course_id }).orderBy('time', 'desc')
      private.forEach(function (item, index) {
        if (!sortedMessage[item.open_id]) {
          sortedMessage[item.open_id] = []
        }
        sortedMessage[item.open_id].push(item)
      })
    }
    privateMessage.push(sortedMessage)
  }

  ctx.state.data = {
    course: course,
    groupMessage: groupMessage,
    privateMessage: privateMessage,
    code: 0,
  }
} 