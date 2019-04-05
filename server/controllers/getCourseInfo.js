const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let course = await mysql("course").where('course_id', courseId)
  let chapterList = await mysql("chapter").where('course_id', courseId)
  ctx.state.data = {
    course: course[0],
    chapterList: chapterList,
    code: 0,
  }
} 