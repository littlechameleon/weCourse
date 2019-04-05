// pages/signIn/signIn.js
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTeacher: 0,
    testId: "",
    userInfo: {},
    test: {},
    radioList: [],
    question: [],
    durations: [3, 5, 8, 10, 15],
    duration: -1,
    title: "",
    result: [],
    answerState: '开始答题',     //回答状态
    sequence: 0,
    testState: '开始测试',
    enablePicker: false,
  },

  changeDuration: function (e) {
    this.setData({
      duration: this.data.durations[e.detail.value]
    })
  },

  submitAnswer: function (value) {
    //提交作答
    util.showBusy('正在提交中')
    value = JSON.stringify(value)
    console.log(value)
    wx.request({
      url: config.service.requestUrl + 'addAnswer',
      data: {
        testId: this.data.testId,
        openId: this.data.userInfo.openId,
        answer: value,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.code == 0) {
          if (res.data.data.repeat == 1) {
            util.showModel('提交失败', '您已经提交过作答，请勿重复提交！')
          }
          else {
            util.showSuccess('提交成功！')
          }
          wx.redirectTo({
            url: '../testResult/testResult?testId=' + this.data.testId + '&sequence=' + this.data.sequence + '&title=' + this.data.title + '&isTeacher=' + this.data.isTeacher,
          })
        } else {
          util.showModel('提交失败！', '提交失败，请确认是否全部回答完');
          console.log('request fail');
        }
      },
      fail(error) {
        util.showModel('提交失败', error);
        console.log('request fail', error);
      }
    })
  },

  formSubmit: function (e) {
    if (this.data.answerState == '开始答题') {
      let _this = this
      let setInter = setInterval(function () {
        if (new Date() > new Date(_this.data.test.end_time)) {
          console.log(e.detail.value)
          console.log(e.detail)
          console.log(e)
          _this.submitAnswer(e.detail.value)
          clearInterval(setInter)
        }
      }, 1000)
      this.setData({
        answerState: '提 交'
      })
    } else {
      console.log(e.detail.value)
      console.log(e.detail)
      console.log(e)
      let value = e.detail.value
      for (let obj in value) {
        if (value[obj].length == 0) {
          util.showModel('提交失败', '题目还没做完！');
          return
        }
      }
      this.submitAnswer(value)
    }

  },


  startTest: function (e) {
    if (this.data.duration === -1) {
      util.showModel('操作失败', '请先选择定时');
    } else {
      wx.request({
        url: config.service.requestUrl + 'startTest',
        data: {
          duration: this.data.duration,
          testId: this.data.testId,
        },
        success: res => {
          if (res.data.code == 0) {
            this.setData({
              test: res.data.data.test
            })
            let _this = this
            let setInter = setInterval(function () {
              let now = new Date()
              if (now < new Date(_this.data.test.end_time)) {
                _this.setData({
                  testState: '测试剩余时间： ' + parseInt(((new Date(_this.data.test.end_time)).getTime() - now) / 1000) + 's',
                  enablePicker: true
                })
              } else {
                _this.setData({
                  testState: '测试已结束',
                  enablePicker: true
                })
                util.showBusy('收集测验结果中')
                let __this = _this
                setTimeout(function () {
                  wx.request({
                    url: config.service.requestUrl + 'collectAnswer',
                    data: {
                      testId: __this.data.testId,
                    },
                    success: res => {
                      if (res.data.code == 0) {
                        wx.redirectTo({
                          url: '../testResult/testResult?testId=' + __this.data.testId + '&sequence=' + __this.data.sequence + '&title=' + __this.data.title + '&isTeacher=' + __this.data.isTeacher,
                        })
                      }
                      else {
                        util.showModel('fail', '测验结果收集失败');
                        console.log('request fail');
                      }
                    },
                    fail: error => {
                      util.showModel('fail', error);
                      console.log('request fail', error);
                    }
                  })
                }, 30000)
                clearInterval(setInter)
              }
            }, 1000)
            console.log('success')
          }
          else {
            util.showModel('fail', '测验启动失败');
            console.log('request fail');
          }
        },
        fail: error => {
          util.showModel('测试启动失败', error);
          console.log('request fail', error);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      testId: options.testId,
      isTeacher: options.isTeacher,
      sequence: parseInt(options.sequence),
      title: options.title,
    })
    wx.request({
      url: config.service.requestUrl + 'getTest',
      data: {
        testId: this.data.testId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            test: res.data.data.test,
            question: res.data.data.question,
          })
          if (this.data.test.state === 0) {
            this.setData({
              testState: '开始测试',
              enablePicker: false
            })
          } else {
            if (new Date(this.data.test.end_time) > new Date()) {
              this.setData({
                testState: '测试进行中',
                enablePicker: true,
                duration: this.data.test.duration
              })
              let _this = this
              let setInter = setInterval(function () {
                let now = new Date()
                if (now < new Date(_this.data.test.end_time)) {
                  _this.setData({
                    testState: '测试剩余时间： ' + parseInt(((new Date(_this.data.test.end_time)).getTime() - now) / 1000) + 's',
                    enablePicker: true
                  })
                } else {
                  _this.setData({
                    testState: '测试已结束',
                    enablePicker: true
                  })
                  util.showBusy('收集测验结果中')
                  let __this = _this
                  setTimeout(function () {
                    wx.request({
                      url: config.service.requestUrl + 'collectAnswer',
                      data: {
                        testId: __this.data.testId,
                      },
                      success: res => {
                        if (res.data.code == 0) {
                          wx.redirectTo({
                            url: '../testResult/testResult?testId=' + __this.data.testId + '&sequence=' + __this.data.sequence + '&title=' + __this.data.title + '&isTeacher=' + __this.data.isTeacher,
                          })
                        }
                        else {
                          util.showModel('fail', '测验结果收集失败');
                          console.log('request fail');
                        }
                      },
                      fail: error => {
                        util.showModel('fail', error);
                        console.log('request fail', error);
                      }
                    })
                  }, 3000)
                  clearInterval(setInter)
                }
              }, 1000)
            } else {
              this.setData({
                testState: '测试已结束',
                enablePicker: true,
                duration: this.data.test.duration
              })
            }
          }
          let question = this.data.question
          let radioList = []
          let result = []
          for (let index in question) {
            let singleResult = []
            let radiosPart = question[index].radio.split('>')
            radioList.push(radiosPart)
            if (question[index].type == 0) {
              singleResult[parseInt(question[index].result)] = 1
              result.push(singleResult)
            }
            else {
              for (let idx in question[index].result) {
                singleResult[parseInt(question[index].result[idx])] = 1
              }
              result.push(singleResult)
            }
          }
          this.setData({
            radioList: radioList,
            result: result,
          })
          if (this.data.test.state == 2) {
            wx.redirectTo({
              url: '../testResult/testResult?testId=' + this.data.testId + '&sequence=' + this.data.sequence + '&title=' + this.data.title + '&isTeacher=' + this.data.isTeacher,
            })
          }
        }
        else {
          util.showModel('fail', '测试题目获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('测试题目获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})