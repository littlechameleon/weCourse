const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let chapterId = ctx.request.query.chapterId
  let checkIn = {
    open_id: openId,
    chapter_id: chapterId,
  }
  let result = await mysql('checkIn').insert(checkIn)

  ctx.state.data = {
    checkIn: result,
    code: 0,
  }
}