const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let chapterList = await mysql('chapter').where({'course_id': courseId})
  ctx.state.data = {
    chapterList: chapterList,
    code: 0,
  }
} 