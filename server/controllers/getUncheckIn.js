const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let chapterId = ctx.request.query.chapterId
  let checkIn = await mysql('checkIn').where('chapter_id', chapterId)
  let unCheckIn = []
  let student = await mysql('student').join('chapter', 'chapter.course_id', '=', 'student.course_id').where('chapter.chapter_id', chapterId)
  
  checkIn = checkIn.map(obj=>{
    return obj.open_id
  })
  for(let index in student){
    if(checkIn.indexOf(student[index].open_id) == -1){
      unCheckIn.push(student[index])
    }
  }

  ctx.state.data = {
    unCheckIn: unCheckIn,
    code: 0,
  }
}