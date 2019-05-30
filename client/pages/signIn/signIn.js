// pages/signIn/signIn.js
var config = require('../../config')
var util = require('../../utils/util.js')
var wscoordinate = require('../../utils/WSCoordinate.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'NTSBZ-REF6O-HMLW5-SQUW4-7HHS2-W2BNC'
})

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTeacher: 0,
    chapterId: -1,
    userInfo: {},
    signIn: null,
    durations: [3, 5, 8, 10, 15],
    duration: -1,
    title: "",
    sequence: 0,
    signInState: '开启签到',
    enablePicker: false,
    location: null,
    checkIn: null,
    enableCheckIn: false,
  },

  changeDuration: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  getLocation: function(){
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      wx.getLocation({
                        type: 'gcj02',
                        success: res => {
                          console.log(res)
                          this.setData({
                            location: res,
                          })
                        },
                      })
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.getLocation({
            type: 'gcj02',
            success: res => {
              console.log(res)
              this.setData({
                location: res,
              })
            },
          })
        }
      }
    })
  },

  startCheckIn: function(){
    if (!this.data.location) {
      util.showModel('定位失败', '请允许小程序获取位置权限！')
      this.getLocation()
    }else{
      //计算师生距离
      let teacherLocation = wscoordinate.transformFromGCJToWGS(this.data.signIn.latitude, this.data.signIn.longitude)
      let studentLocation = wscoordinate.transformFromGCJToWGS(this.data.location.latitude, this.data.location.longitude)
      let distance = wscoordinate.distanceByLongNLat(teacherLocation.longitude, teacherLocation.latitude, studentLocation.longitude, studentLocation.latitude)
      console.log('距离为： ' + distance)
      if(distance < 400){
        wx.request({
          url: config.service.requestUrl + 'checkIn',
          data:{
            openId: this.data.userInfo.openId,
            chapterId: this.data.chapterId,
            longitude: this.data.location.longitude,
            latitude: this.data.location.latitude,
            distance: distance,
          },
          success: res=>{
            if (res.data.code == 0) {
              this.setData({
                signInState: '已签到',
                enableCheckIn: true,
              })
              util.showModel('签到成功', '你是第' + res.data.data.rank + '个签到的人!')
            }
            else {
              util.showModel('fail', '签到失败');
              console.log('request fail');
            }
          },
          fail: error => {
            util.showModel('签到失败', error);
            console.log('request fail', error);
          }
        })
      }else{
        util.showModal('签到失败', '距离过远，打开手机位置定位会更准确哦！')
      }
    }
  },

  setDuration: function (data) {
    let duration = -1
    this.data.durations.forEach(function (item, index) {
      if (item == data) {
        duration = index
      }
    })
    this.setData({
      duration: duration
    })
  },

  startSignIn: function (e) {
    if (this.data.duration === -1) {
      util.showModel('操作失败', '请先选择定时');
    } else if(!this.data.location){
      util.showModel('定位失败', '请允许小程序获取位置权限！')
      this.getLocation()
    }else{
      wx.request({
        url: config.service.requestUrl + 'startSignIn',
        data: {
          duration: this.data.durations[this.data.duration],
          chapterId: this.data.chapterId,
          longitude: this.data.location.longitude,
          latitude: this.data.location.latitude,
        },
        success: res => {
          if (res.data.code == 0) {
            this.setData({
              signIn: res.data.data.signIn
            })
            let _this = this
            let setInter = setInterval(function () {
              let now = new Date()
              if (now < new Date(_this.data.signIn.end_time)) {
                _this.setData({
                  signInState: '签到剩余时间： ' + parseInt(((new Date(_this.data.signIn.end_time)).getTime() - now) / 1000) + 's',
                  enablePicker: true,
                })
              } else {
                _this.setData({
                  signInState: '签到已结束',
                })
                util.showBusy('收集签到结果中')
                let __this = _this
                setTimeout(function () {
                  wx.request({
                    url: config.service.requestUrl + 'collectCheckIn',
                    data: {
                      chapterId: __this.data.chapterId,
                    },
                    success: res => {
                      if (res.data.code == 0) {
                        wx.hideToast();
                        wx.redirectTo({
                          url: '../signInResult/signInResult?chapterId=' + __this.data.chapterId + '&sequence=' + __this.data.sequence + '&title=' + __this.data.title + '&isTeacher=' + __this.data.isTeacher,
                        })
                      }
                      else {
                        util.showModel('fail', '签到结果收集失败');
                        console.log('request fail');
                      }
                    },
                    fail: error => {
                      util.showModel('fail', error);
                      console.log('request fail', error);
                    }
                  })
                }, 5000)
                clearInterval(setInter)
              }
            }, 1000)
          }
          else {
            util.showModel('fail', '签到启动失败');
            console.log('request fail');
          }
        },
        fail: error => {
          util.showModel('签到启动失败', error);
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
      chapterId: options.chapterId,
      isTeacher: options.isTeacher,
      sequence: parseInt(options.sequence),
      title: options.title,
    })
    this.getLocation()    

    if(this.data.isTeacher == 0){
      wx.request({
        url: config.service.requestUrl + 'getCheckIn',
        data: {
          chapterId: this.data.chapterId,
          openId: this.data.userInfo.openId,
        },
        success: res => {
          if (res.data.code == 0) {
            let checkIn = res.data.data.checkIn
            if (checkIn) {
              this.setData({
                enableCheckIn: true,
                signInState: '已签到'
              })
            }
          }
          else {
            util.showModel('fail', '签到信息获取失败');
            console.log('request fail');
          }
        },
        fail: error => {
          util.showModel('签到信息获取失败', error);
          console.log('request fail', error);
        }
      })
    }

    wx.request({
      url: config.service.requestUrl + 'getSignIn',
      data: {
        chapterId: this.data.chapterId,
      },
      success: res => {
        if (res.data.code == 0) {
          let signIn = res.data.data.signIn
          if(signIn){
            this.setData({
              signIn: signIn,
              enablePicker: true,
            })
            this.setDuration(signIn.duration)
            if(signIn.state == 1){
              let _this = this
              let setInter = setInterval(function () {
                let now = new Date()
                if (now < new Date(_this.data.signIn.end_time)) {
                  _this.setData({
                    signInState: '签到剩余时间： ' + parseInt(((new Date(_this.data.signIn.end_time)).getTime() - now) / 1000) + 's',
                  })
                } else {
                  _this.setData({
                    signInState: '签到已结束',
                    enableCheckIn: true,
                  })
                  util.showBusy('收集签到结果中')
                  let __this = _this
                  setTimeout(function () {
                    wx.request({
                      url: config.service.requestUrl + 'collectCheckIn',
                      data: {
                        chapterId: __this.data.chapterId,
                      },
                      success: res => {
                        if (res.data.code == 0) {
                          wx.hideToast();
                          wx.redirectTo({
                            url: '../signInResult/signInResult?chapterId=' + __this.data.chapterId + '&sequence=' + __this.data.sequence + '&title=' + __this.data.title + '&isTeacher=' + __this.data.isTeacher,
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
                  }, 5000)
                  clearInterval(setInter)
                }
              }, 1000)
            }
            else{
              this.setData({
                signInState: '签到已结束',
                enableCheckIn: true
              })
              wx.request({
                url: config.service.requestUrl + 'collectCheckIn',
                data: {
                  chapterId: this.data.chapterId,
                },
                success: res => {
                  if (res.data.code == 0) {
                    wx.redirectTo({
                      url: '../signInResult/signInResult?chapterId=' + this.data.chapterId + '&sequence=' + this.data.sequence + '&title=' + this.data.title + '&isTeacher=' + this.data.isTeacher,
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
            }
            
          }
        }
        else {
          util.showModel('fail', '签到表获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('签到表获取失败', error);
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