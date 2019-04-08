const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let duration = ctx.request.query.duration
  let chapterId = ctx.request.query.chapterId
  let latitude = ctx.request.query.latitude
  let longitude = ctx.request.query.longitude
  let startTime = new Date()
  let endTime = new Date(startTime.getTime() + duration * 60000)
  let signIn = {
    duration: duration,
    state: 1,
    start_time: startTime,
    end_time: endTime,
    chapter_id: chapterId,
    number: 0,
    longitude: longitude,
    latitude: latitude,
    absence: 0,
  }
  let result = await mysql('signIn').insert(signIn)

  ctx.state.data = {
    signIn: signIn,
    code: 0,
  }
}