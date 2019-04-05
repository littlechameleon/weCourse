const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let chapterId = ctx.request.query.chapterId
  let testList = await mysql("test").select('test_id', 'state', 'count').where('chapter_id', chapterId)
  ctx.state.data = {
    testList: testList,
    code: 0,
  }
} 