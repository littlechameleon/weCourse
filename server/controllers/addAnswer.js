const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let openId = ctx.request.body.openId
  let testId = ctx.request.body.testId
  let answer = JSON.parse(ctx.request.body.answer)

  let query = await mysql('score').where({test_id: testId, open_id: openId})
  let test = await mysql('test').where('test_id', testId)
  let repeat = 0
  if(query.length === 0){
    let total = 0
    for (let obj in answer) {
      let score = 0
      let singleAnswer = answer[obj]
      let questionId = parseInt(obj)
      let question = await mysql('question').where('id', questionId)
      if (question[0].type == 1) {
        let count = 0
        let result = question[0].result.split(',')
        for (let index in singleAnswer) {
          let flag = 0  //是否为正确答案
          for (let idx in result) {
            if (result[idx] == singleAnswer[index]) {
              count++
              flag = 1
              break
            }
          }
          if (flag == 0) {
            count = 0
            break
          }
        }
        score = parseInt(count * 10 / result.length)
        singleAnswer = singleAnswer.join(',')
      } else {
        if (question[0].result == singleAnswer) {
          score = 10
        }
      }
      total += score
      let choose = {
        test_id: testId,
        question_id: parseInt(obj),
        answer: singleAnswer,
        open_id: openId,
        score: score,
      }
      await mysql('answer').insert(choose)
    }
    let score = {
      test_id: testId,
      open_id: openId,
      score: total,
      total: test[0].count * 10,
    }
    let result = await mysql('score').insert(score)
    query = await mysql('score').where({ test_id: testId, open_id: openId })
  }
  else{
    repeat = 1
  }

  ctx.state.data = {
    code: 0,
    repeat: repeat,
    query: query,
  }
} 