const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let testId = ctx.request.query.testId
  let isTeacher = ctx.request.query.isTeacher
  let openId = ctx.request.query.openId
  let score,answer
  if(isTeacher != 0){
    scores = await mysql('score').join('student', 'student.open_id', '=', 'score.open_id').where('score.test_id', testId)
  }
  else{
    scores = await mysql('score').join('student', 'student.open_id', '=', 'score.open_id').where({'score.test_id': testId, 'student.open_id': openId}).orderBy('score.score','asc')
    answer = await mysql('answer').where('open_id', openId).orderBy('question_id','asc')
  }
  ctx.state.data = {
    scores: scores,
    answer: answer,
    code: 0,
  }
} 