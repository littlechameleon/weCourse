const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let radioList = ctx.request.body.radios.split('#')
  let chapterId = ctx.request.body.chapterId

  let newTest = {
    chapter_id: chapterId,
    state: 0,
    count: radioList.length-1,
  }
  let test = await mysql("test").insert(newTest)

  for (let index in radioList) {
    if(index != 0){
      let radioPart = radioList[index].split('>')
      let result = []
      let radio = []
      let count = 0
      for(let i in radioPart){
        if(i != 0){
          if (radioPart[i][0] === '*') {
            count++
            result.push(i-1)
            radioPart[i] = radioPart[i].substr(1)
          }
          radio.push(radioPart[i])
        }
      }
      let resultList = result.join(',')
      let radios = radio.join('>')
      let newQuestion = {
        test_id : test[0],
        main: radioPart[0],
        radio: radios,
        result: resultList,
        type: count===1?0:1
      }
      let question = await mysql("question").insert(newQuestion)
    }
  }

  ctx.state.data = {
    code: 0,
    test: test[0],
  }
} 