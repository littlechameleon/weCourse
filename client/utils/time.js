function timeSort(list){
  let sortedList = {}
  let today = new Date(new Date().setHours(0, 0, 0))
  let yesterday = new Date(new Date(new Date().setHours(0, 0, 0)).setDate(today.getDate() - 1))
  list.forEach(function (item, index) {
    let date = new Date(item.time)
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    item.detailTime = hour + minute
    if (date.getTime() > today.getTime()) {
      item.generalTime = '今天'
    } else if (date.getTime() > yesterday.getTime()) {
      item.generalTime = '昨天'
    } else {
      let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      item.generalTime = month + day
    }
    if (!sortedList[item.generalTime]) {
      sortedList[item.generalTime] = []
    }
    sortedList[item.generalTime].push(item)
  })
  return sortedList
}

function timeChange(rawTime){
  let today = new Date(new Date().setHours(0, 0, 0))
  let yesterday = new Date(new Date(new Date().setHours(0, 0, 0)).setDate(today.getDate() - 1))

  let date = new Date(rawTime)
  let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() + ':';
  let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  let showTime
  if (date.getTime() > today.getTime()) {
    showTime = hour + minute
  } else if (date.getTime() > yesterday.getTime()) {
    showTime = '昨天 ' + hour + minute
  } else {
    let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    showTime = month + day
  }
  return showTime
}


module.exports = { timeSort, timeChange }