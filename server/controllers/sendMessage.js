const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.body.openId
  let isTeacher = ctx.request.body.isTeacher
  let courseId = ctx.request.body.courseId
  let targetId = ctx.request.body.targetId
  let content = ctx.request.body.content

  let message
  if(isTeacher == 0){
    message = {
      courseId: courseId,
      type: 1,
      direction: 0,
      teacher: targetId,
      student: openId,
      content: content,
      time: new Date(),
      state: 0,
    }
  }else{
    message = {
      courseId: courseId,
      type: 1,
      direction: 1,
      teacher: openId,
      student: targetId,
      content: content,
      time: new Date(),
      state: 0,
    }
  }



  await mysql('message').insert(message)

  ctx.state.data = {
    code: 0,
  }
} 