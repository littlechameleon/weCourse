const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let chapterId = ctx.request.query.chapterId
  let checkIn = await mysql('checkIn').where('chapter_id', chapterId)
  let course = await mysql('course').join('chapter', 'chapter.course_id', '=', 'course.course_id').where('chapter.chapter_id', chapterId)
  let signIn = await mysql('signIn').update({number: checkIn.length, absent: course[0].number-checkIn.length, state: 2})

  ctx.state.data = {
    code: 0,
  }
}