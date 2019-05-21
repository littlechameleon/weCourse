const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let studentList = await mysql('student').where('course_id', courseId)

  ctx.state.data = {
    studentList: studentList,
    code: 0,
  }
}