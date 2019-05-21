// pages/feedback/feedback.js
var config = require('../../config')
var util = require('../../utils/util.js')
var time = require('../../utils/time.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    setInter: '',
    list: [],
    load: true,
    isTeacher: 0,
    courseId: null,
    userInfo: null,
    course: null,
    groupUnreadCount: null,
    privateUnreadCount: null,
    groupTime: null,
    privateTime: null,
    groupMessage: null,
    privateMessage: null,

  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },

  enterChat: function(e){
    wx.navigateTo({
      url: '../chat/chat?courseId=' + e.currentTarget.dataset.courseId + '&isTeacher=' + this.data.isTeacher + '&target=' + e.currentTarget.dataset.id,
    })
  },

  enterGroupChat: function (e) {
    wx.navigateTo({
      url: '../groupChat/groupChat?courseId=' + e.currentTarget.dataset.courseId + '&isTeacher=' + this.data.isTeacher,
    })
  },

  getFeedback: function(){
    wx.request({
      url: config.service.requestUrl + 'getFeedback',
      data: {
        courseId: this.data.courseId,
        isTeacher: this.data.isTeacher,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            course: res.data.data.course,
            groupMessage: [res.data.data.groupMessage],
            privateMessage: [res.data.data.privateMessage],
          })
          this.sortMessage()
        }
        else {
          util.showModel('fail', '聊天列表获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('聊天列表获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  getAllFeedback: function () {
    wx.request({
      url: config.service.requestUrl + 'getAllFeedback',
      data: {
        isTeacher: this.data.isTeacher,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            course: res.data.data.course,
            groupMessage: res.data.data.groupMessage,
            privateMessage: res.data.data.privateMessage,
          })
          this.sortMessage()
        }
        else {
          util.showModel('fail', '聊天列表获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('聊天列表获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  sortMessage: function(){
    let groupMessage = this.data.groupMessage
    let privateMessage = this.data.privateMessage
    let groupUnreadCount = [], privateUnreadCount = []
    let groupTime = [], privateTime = []
    for(let index = 0;index<groupMessage.length;index++){
      let count = 0
      groupMessage[index].forEach( (item,index) => {
        if(item.state == 0){
          count++
        }
      })
      groupUnreadCount.push(count)
      groupTime.push(time.timeChange(groupMessage[index][0].time))
    }

    for (let index = 0; index < privateMessage.length; index++) {
      let counts = {}, timeObj = {}
      for(let idx in privateMessage[index]){
        let count = 0
        privateMessage[index][idx].forEach((it) => {
          if (it.state == 0) {
            count++
          }
        })
        counts[idx] = count
        timeObj[idx] = time.timeChange(privateMessage[index][idx][0].time)
      }
      privateUnreadCount.push(counts)
      privateTime.push(timeObj)
    }

    this.setData({
      groupTime: groupTime,
      privateTime: privateTime,
      groupUnreadCount: groupUnreadCount,
      privateUnreadCount: privateUnreadCount,
    })
    let list = [{}];
    for (let i = 0; i < this.data.course.length; i++) {
      list[i] = {};
      list[i].name = this.data.course[i].title;
      list[i].id = i;
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    this.setData({
      userInfo: app.globalData.userInfo,
      isTeacher: options.isTeacher,
    })
    if(options.courseId){
      this.setData({
        courseId: options.courseId,
      })
    }
    if(this.data.courseId){
      this.getFeedback()
    }else{
      this.getAllFeedback()
    }


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    this.data.setInter = setInterval(function () {
      if (_this.data.courseId) {
        _this.getFeedback()
      } else {
        _this.getAllFeedback()
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