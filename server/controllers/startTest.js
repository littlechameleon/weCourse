const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let duration = ctx.request.query.duration
  let testId = ctx.request.query.testId
  let startTime = new Date()
  let endTime = new Date(startTime.getTime() + duration*60000)
  let test = {
    duration: duration,
    state: 1,
    start_time: startTime,
    end_time: endTime,
  }
  let update  =  await mysql('test').update(test).where('test_id',testId)

  let result = await mysql('test').where('test_id',testId)
  ctx.state.data = {
    test: result[0],
    code: 0,
  }
}