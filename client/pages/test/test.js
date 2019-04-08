// pages/test/test.js
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapterId: "",
    sequence: -1,
    title: "",
    testList: [],
    isTeacher: 0,
  },

  addTest: function(){
    wx.navigateTo({
      url: '../addTest/addTest?chapterId=' + this.data.chapterId,
    })
  },

  enterTest: function(e){
    if(this.data.testList[e.currentTarget.dataset.index].state == 2){
      wx.navigateTo({
        url: '../testResult/testResult?testId=' + e.currentTarget.dataset.id + '&sequence=' + this.data.sequence + '&title=' + this.data.title + '&isTeacher=' + this.data.isTeacher,
      })
    } else if (this.data.testList[e.currentTarget.dataset.index].state == 0 && this.data.isTeacher == 0){
      util.showModel('fail', '测试题目还未开启！')
    }else{
      wx.navigateTo({
        url: '../testDetail/testDetail?testId=' + e.currentTarget.dataset.id + '&isTeacher=' + this.data.isTeacher + '&sequence=' + this.data.sequence + '&title=' + this.data.title,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chapterId: options.chapterId,
      sequence: parseInt(options.sequence),
      title: options.title,
      isTeacher: options.isTeacher,
    })
    wx.request({
      url: config.service.requestUrl + 'getAllTest',
      data: {
        chapterId: this.data.chapterId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            testList: res.data.data.testList,
          })
        }
        else {
          util.showModel('fail', '测验题目获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('fail', error);
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