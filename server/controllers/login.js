const { mysql } = require('../qcloud')
// 登录授权接口
module.exports = async (ctx, next) => {
    // 通过 Koa 中间件进行登录之后
    // 登录信息会被存储到 ctx.state.$wxInfo
    // 具体查看：
    if (ctx.state.$wxInfo.loginState) {
        ctx.state.data = ctx.state.$wxInfo.userinfo
        ctx.state.data['time'] = Math.floor(Date.now() / 1000)
        let userInfo = ctx.state.$wxInfo.userinfo.userinfo
        let openId = userInfo.openId
        let nickName = userInfo.nickName
        let avatarUrl = userInfo.avatarUrl
        let gender = userInfo.gender
        let result = await mysql('student').where('nickname', nickName)
        for(index in result){
          if(!result[index].open_id){
            let courseId = result[index].course_id
            let res = await mysql('student').where({open_id: openId, course_id: courseId})
            if(res.length === 0 ){
              let id = result[index].id
              let done = await mysql('student').update({open_id : openId, avatarUrl: avatarUrl, gender: gender}).where('id', id)
            }
          }
        }
    }
}
