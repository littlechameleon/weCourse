const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId
  let testId = ctx.request.query.testId
  let score = await mysql('score').where({ test_id: testId, open_id: openId })

  ctx.state.data = {
    score: score[0],
    code: 0,
  }
}