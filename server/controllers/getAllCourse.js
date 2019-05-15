const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let type = ctx.request.query.type
  let courseList = []
  if(type == 0){
    courseList = await mysql('course').join('student', 'course.course_id' , '=' , 'student.course_id').where('student.open_id', openId)
  }else{
    courseList = await mysql("course").where('teacher_id', openId)
  }
  ctx.state.data = {
    courseList: courseList,
    code: 0,
  }
} 