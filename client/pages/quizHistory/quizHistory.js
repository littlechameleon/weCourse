// pages/quizHistory/quizHistory.js
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
    userInfo: {},
    courseId: null,
    isTeacher: 0,
    quizList: null,
  },

  getQuiz: function () {
    wx.request({
      url: config.service.requestUrl + 'getQuiz',
      data: {
        courseId: this.data.courseId,
      },
      success: res => {
        if (res.data.code == 0) {
          let quizList = time.timeSort(res.data.data.quizList)
          this.setData({
            quizList: quizList,
          })
        }
        else {
          util.showModel('fail', '历史提问信息获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('历史提问信息获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  getSelfQuiz: function () {
    wx.request({
      url: config.service.requestUrl + 'getSelfQuiz',
      data: {
        courseId: this.data.courseId,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {
          let quizList = time.timeSort(res.data.data.quizList)
          this.setData({
            quizList: quizList,
          })
        }
        else {
          util.showModel('fail', '历史提问信息获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('历史提问信息获取失败', error);
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
      courseId: options.courseId,
      isTeacher: options.isTeacher,
    })
    if (this.data.isTeacher == 0) {
      this.getSelfQuiz()
    } else {
      this.getQuiz()
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