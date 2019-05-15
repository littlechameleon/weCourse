const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let testId = ctx.request.query.testId
  let question = await mysql('question').where('question.test_id', testId)
  for(let index in question){
    let answer = await mysql('answer').where('answer.question_id',question[index].id)
    let distribution = []
    let radios = question[index].radio.split('>')
    for(let radio in radios){
      distribution[radio] = 0
    }
    for(let idx in answer){
      let answerList =  answer[idx].answer.split(',')
      for(let i in answerList){
        distribution[parseInt(answerList[i])]++
      }
    }
    await mysql('question').update('distribution',distribution.join(',')).where('id', question[index].id)
  }
  let score = await mysql('score').where('test_id', testId)
  let average = await mysql('score').avg('score').where('test_id', testId)
  let lowest = await mysql('score').min('score').where('test_id', testId)
  let highest = await mysql('score').max('score').where('test_id', testId)
  for(let index in score){
    let scores = await mysql('score').where('score', '>', score[index].score)     //缺少一个条件
    await mysql('score').update('rank', scores.length + 1).where('id', score[index].id)
  }
  await mysql('test').update({ number: score.length, state: 2, average: parseFloat(average[0]['avg(`score`)'].toFixed(2)), lowest: lowest[0]['min(`score`)'], highest:highest[0]['max(`score`)']}).where('test_id', testId)


  ctx.state.data = {
    code: 0,
  }
} 