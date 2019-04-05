const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let chapterList = ctx.request.body.chapters.split('\n')
  let courseId = ctx.request.body.courseId
  for(let index in chapterList){
    if(chapterList[index]!==""){
      let chapter = {
        course_id: courseId,
        sequence: index,
        title: chapterList[index],
      }
      await mysql("chapter").insert(chapter)
    }
  }

  ctx.state.data = {
    code: 0,
    courseId: courseId,
  }
} 