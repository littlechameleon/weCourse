// pages/dataCollect/dataCollect.js
var config = require('../../config')
var util = require('../../utils/util.js')
var time = require('../../utils/time.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isTeacher: 0,
    courseId: null,
    courseData: null,
    selfData: null,
    studentData: null,
  },

  sortTime: function(){
    let selfData = this.data.selfData
    for(let index=0;index<selfData.quiz.length;index++){
      selfData.quiz[index].showTime = time.timeChange(selfData.quiz[index].time)
    }
    this.setData({
      selfData: selfData
    })
  },

  getDataCollect: function(){
    wx.request({
      url: config.service.requestUrl + 'dataCollect',
      data: {
        courseId: this.data.courseId,
        openId: this.data.userInfo.openId,
        isTeacher: this.data.isTeacher
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            courseData: res.data.data.courseData,
            selfData: res.data.data.selfData,
            studentData: res.data.data.studentData,
          })
          if(this.data.isTeacher == 0){
            this.sortTime()
          }
        }
        else {
          util.showModel('fail', '汇总数据获取失败！');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('汇总数据获取失败', error);
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
    this.getDataCollect()
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