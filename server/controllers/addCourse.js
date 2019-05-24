const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let courseInfo = ctx.request.body.courseInfo.split('#')
  let openId = ctx.request.body.openId
  let avatarUrl = ctx.request.body.avatarUrl
  let course = {
    title: courseInfo[1],
    intro: courseInfo[2],
    student: courseInfo[3],
    time: courseInfo[4],
    place: courseInfo[5],
    teacher_id: openId,
    create_time: new Date(),
    teacherAvatarUrl: avatarUrl,
    state: 0,
    groupState: 0,
  }

  let result =  await mysql("course").insert(course)
  
  ctx.state.data = {
    code: 0,
    courseId: result[0],
  }
} 