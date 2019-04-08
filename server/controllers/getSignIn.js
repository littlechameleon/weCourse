const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let chapterId = ctx.request.query.chapterId
  let signIn = await mysql('signIn').where('chapter_id', chapterId)

  ctx.state.data = {
    signIn: signIn[0],
    code: 0,
  }
}