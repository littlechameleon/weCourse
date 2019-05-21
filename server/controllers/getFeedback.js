const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let isTeacher = ctx.request.query.isTeacher
  let openId = ctx.request.query.openId
  let courseId = ctx.request.query.courseId


  let course = await mysql('course').where('course_id', courseId)

  let groupMessage = await mysql('message').where({courseId: courseId, type: 0}).orderBy('time', 'desc')
  let privateMessage
  let sortedMessage = {}

  if(isTeacher == 0 ){
    privateMessage = await mysql('message').where({ courseId: courseId, type: 1, student: openId }).orderBy('time', 'desc')
    sortedMessage[course[0].teacher_id] = privateMessage
  }else{
    privateMessage = await mysql('message').join('student', 'student.open_id', '=', 'message.student').where({ 'message.courseId': courseId, 'message.type': 1, 'message.teacher': openId, 'student.course_id': courseId }).orderBy('time', 'desc')
    privateMessage.forEach(function(item, index){
      if(!sortedMessage[item.open_id]){
        sortedMessage[item.open_id] = []
      }
      sortedMessage[item.open_id].push(item)
    })
  }

  ctx.state.data = {
    course: course,
    groupMessage: groupMessage,
    privateMessage: sortedMessage,
    code: 0,
  }
} 