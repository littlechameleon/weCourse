const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let quizList = await mysql('quiz').join('student', 'student.open_id', '=', 'quiz.openId').where({'quiz.courseId': courseId, 'student.course_id': courseId}).orderBy('time', 'desc')

  ctx.state.data = {
    quizList: quizList,
    code: 0,
  }
}