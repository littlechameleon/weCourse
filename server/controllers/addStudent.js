const { mysql } = require('../qcloud')

module.exports = async ctx => {
  let studentList = ctx.request.body.students.split('\n')
  let courseId = ctx.request.body.courseId
  for (let index in studentList) {
    if (studentList[index] !== "") {
      let studentItem = studentList[index].split('\t')
        let student = {
          course_id: courseId,
          name: studentItem[0],
          register_id: studentItem[1],
          nickname: studentItem[2]
        }
      await mysql("student").insert(student)
    }
  }

  ctx.state.data = {
    code: 0,
    courseId: courseId,
  }
} 