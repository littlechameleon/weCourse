const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let duration = ctx.request.query.duration
  let chapterId = ctx.request.query.chapterId
  let startTime = new Date()
  let endTime = new Date(startTime.getTime() + duration * 60000)
  let signIn = {
    duration: duration,
    state: 1,
    start_time: startTime,
    end_time: endTime,
    chapter_id: chapterId,
  }
  let result = await mysql('signIn').insert(signIn)

  ctx.state.data = {
    signIn: result,
    code: 0,
  }
}