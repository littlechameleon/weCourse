const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let chapterId = ctx.request.query.chapterId
  let result = await mysql('checkIn').where({chapter_id:chapterId, open_id: openId})

  ctx.state.data = {
    result: result,
    code: 0,
  }
}