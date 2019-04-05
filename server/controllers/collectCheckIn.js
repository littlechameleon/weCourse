const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let chapterId = ctx.request.query.chapterId
  let checkIn = await mysql('checkIn').select('open_id').where('chapter_id', chapterId)
  let signIn = await mysql('signIn').update('number', checkIn.length)
  let unCheckIn = await mysql('student').join('chapter', 'chapter.course_id', '=', 'student.course_id').where('chapter.chapter_id', chapterId).andWhereNotIn('student.open_id', checkIn)

  ctx.state.data = {
    checkIn: result,
    unCheckIn: unCheckIn,
    code: 0,
  }
}