const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let testId = ctx.request.query.testId
  let isTeacher = ctx.request.query.isTeacher
  let openId = ctx.request.query.openId
  let score,answer
  if(isTeacher != 0){
    let course = await mysql('test').join('chapter','chapter.chapter_id','test.chapter_id').where('test.test_id', testId)
    scores = await mysql('score').join('student', 'student.open_id', '=', 'score.open_id').where({'score.test_id': testId, 'student.course_id': course[0].course_id}).orderBy('score.score','asc')
  }
  else{
    scores = await mysql('score').where({'test_id': testId, 'open_id': openId})
    answer = await mysql('answer').where({'open_id': openId, 'test_id': testId}).orderBy('question_id','asc')
  }
  ctx.state.data = {
    scores: scores,
    answer: answer,
    code: 0,
  }
} 