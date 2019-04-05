const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let testId = ctx.request.query.testId
  let test = await mysql("test").where('test_id', testId)
  let question = await mysql("question").where('test_id', testId)
  ctx.state.data = {
    test: test[0],
    question: question,
    code: 0,
  }
} 