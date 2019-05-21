const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.query.openId

  ctx.state.data = {
    code: 0,
  }
} 