const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let chapterId = ctx.request.query.chapterId
  let checkIn = await mysql('checkIn').where({chapter_id:chapterId, open_id: openId})

  ctx.state.data = {
    checkIn: checkIn[0],
    code: 0,
  }
}