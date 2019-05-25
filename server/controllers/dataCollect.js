const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseId = ctx.request.query.courseId
  let openId = ctx.request.query.openId
  let isTeacher = ctx.request.query.isTeacher

  let courseData = {}, selfData = {}, studentData = []
  let test = await mysql('test').join('chapter', 'chapter.chapter_id','test.chapter_id').where('chapter.course_id', courseId)
  courseData.testCount = test.length
  let signIn = await mysql('signIn').join('chapter', 'chapter.chapter_id', 'signIn.chapter_id').where('chapter.course_id', courseId)
  courseData.signInCount = signIn.length
  let quiz = await mysql('quiz').where('courseId', courseId)
  courseData.quizCount = quiz.length

  if(isTeacher == 0){
    let score = await mysql('test').join('chapter', 'chapter.chapter_id', 'test.chapter_id').join('score','score.test_id','test.test_id').where({'chapter.course_id': courseId, 'score.open_id': openId})
    selfData.score = score
    let checkIn = await mysql('checkIn').join('chapter', 'chapter.chapter_id', 'checkIn.chapter_id').where({'chapter.course_id': courseId, 'checkIn.open_id': openId})
    selfData.checkIn = checkIn
    let selfQuiz = await mysql('quiz').where({'courseId': courseId, 'openId': openId})
    selfData.quiz = selfQuiz
  }else{
    let student = await mysql('student').where({'course_id': courseId})
    student.forEach(function(item, index){
      let data = {}
      data.student = item



      studentData.push(data)
    })
  }


  ctx.state.data = {
    courseData: courseData,
    selfData: selfData,
    studentData: studentData,
    code: 0,
  }
}