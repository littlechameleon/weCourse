const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId

  let course = await mysql('course').where('course_id', courseId)
  let groupMessage = await mysql('message').where({ courseId: courseId, type: 0 }).orderBy('time', 'asc')
  for(let index=0;index<groupMessage.length;index++){
    if(groupMessage[index].student != course.teacher_id){
      let studentInfo = await mysql('student').where({course_id: courseId, open_id: groupMessage[index].student})
      groupMessage[index].studentInfo = studentInfo[0]
    }
  }

  ctx.state.data = {
    course: course[0],
    messageList: groupMessage,
    code: 0,
  }
} 