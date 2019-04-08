const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let chapterId = ctx.request.query.chapterId
  let latitude = ctx.request.query.latitude
  let longitude = ctx.request.query.longitude
  let distance = ctx.request.query.distance

  let checkIn = {
    open_id: openId,
    chapter_id: chapterId,
    longitude: longitude,
    latitude: latitude,
    distance: distance,
  }
  await mysql('checkIn').insert(checkIn)
  let signIn = await mysql('signIn').where('chapter_id', chapterId)
  signIn[0].number++
  let result = await mysql('signIn').update('number', signIn[0].number).where('chapter_id', chapterId)

  ctx.state.data = {
    rank: signIn[0].number,
    code: 0,
  }
}