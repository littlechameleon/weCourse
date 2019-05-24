// pages/chat/chat.js
var config = require('../../config')
var util = require('../../utils/util.js')
var time = require('../../utils/time.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    InputBottom: 0,
    setInter: '',
    isTeacher: null,
    courseId: null,
    course: null,
    targetId: null,
    userInfo: {},
    messageList: null,
    newMessage: '',
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },
  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },


  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    wx.createSelectorQuery().select('.page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom
      })
    }).exec()
  },

  bindInput: function(e){
    this.setData({
      newMessage: e.detail.value
    })
  },

  sortMessage: function(){
    let messageList = this.data.messageList
    for(let index=0;index<messageList.length;index++){
      messageList[index].showTime = time.timeChange(messageList[index].time)
    }
    this.setData({
      messageList: messageList
    })
  },

  setGroupMessageRead: function(){
    wx.request({
      url: config.service.requestUrl + 'setGroupMessageRead',
      data: {
        courseId: this.data.courseId,
        isTeacher: this.data.isTeacher,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {

        }
        else {
          util.showModel('fail', '消息设置已读失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('消息设置失败', error);
        console.log('request fail', error);
      }
    })
  },

  setMessageRead: function(){
    wx.request({
      url: config.service.requestUrl + 'setMessageRead',
      data: {
        courseId: this.data.courseId,
        isTeacher: this.data.isTeacher,
        targetId: this.data.targetId,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {

        }
        else {
          util.showModel('fail', '消息设置已读失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('消息设置失败', error);
        console.log('request fail', error);
      }
    })
  },

  sendChat: function(){
    if(this.data.targetId){
      this.sendMessage()
    }else{
      this.sendGroupMessage()
    }
  },

  sendGroupMessage: function () {
    wx.request({
      url: config.service.requestUrl + 'sendGroupMessage',
      data: {
        courseId: this.data.courseId,
        openId: this.data.userInfo.openId,
        content: this.data.newMessage,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        this.setData({
          newMessage: ''
        })
        if (res.data.code == 0) {
          this.getGroupMessage()
        }
        else {
          util.showModel('fail', '消息发送失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('消息发送失败', error);
        console.log('request fail', error);
      }
    })
  },

  sendMessage: function(){
    wx.request({
      url: config.service.requestUrl + 'sendMessage',
      data: {
        courseId: this.data.courseId,
        isTeacher: this.data.isTeacher,
        targetId: this.data.targetId,
        openId: this.data.userInfo.openId,
        content: this.data.newMessage,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            newMessage: ''
          })
          this.getMessage()
        }
        else {
          util.showModel('fail', '消息发送失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('消息发送失败', error);
        console.log('request fail', error);
      }
    })
  },

  getMessage: function(){
    wx.request({
      url: config.service.requestUrl + 'getMessage',
      data: {
        courseId: this.data.courseId,
        isTeacher: this.data.isTeacher,
        targetId: this.data.targetId,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            course: res.data.data.course,
            messageList: res.data.data.messageList,
          })
          this.sortMessage()
          this.setMessageRead()
          this.pageScrollToBottom()
        }
        else {
          util.showModel('fail', '聊天记录获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('聊天记录获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  getGroupMessage: function () {
    wx.request({
      url: config.service.requestUrl + 'getGroupMessage',
      data: {
        courseId: this.data.courseId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            course: res.data.data.course,
            messageList: res.data.data.messageList,
          })
          this.sortMessage()
          this.setGroupMessageRead()
          this.pageScrollToBottom()
        }
        else {
          util.showModel('fail', '聊天记录获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('聊天记录获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      isTeacher: options.isTeacher,
      courseId: options.courseId,
    })
    if (options.targetId) {
      this.setData({
        targetId: options.targetId,
      })
    }
    if (this.data.targetId) {
      this.getMessage()
    } else {
      this.getGroupMessage()
    }
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
    let _this = this
    this.data.setInter = setInterval(function () {
      if (_this.data.targetId) {
        _this.getMessage()
      } else {
        _this.getGroupMessage()
      }
    }, 5000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.setInter)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.setInter)
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