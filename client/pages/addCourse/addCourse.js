// pages/addCourse/addCourse.js
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    courseInfo: ""
  },

  bindtapcreate: function(){
    wx.request({
      url: config.service.requestUrl + 'addCourse',
      data: {
        courseInfo: this.data.courseInfo,
        openId: this.data.userInfo.openId
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if(res.data.code==0){
          util.showSuccess('创建成功！')
          
          wx.redirectTo({
            url: '../addChapter/addChapter?courseId=' + res.data.data.courseId,
          })
        }else{
          util.showModel('创建失败！', '创建失败，请检查格式是否正确');
          console.log('request fail');
        }
      },
      fail(error) {
        util.showModel('创建失败', error);
        console.log('request fail', error);
      }
    })
  },

  bindinput: function(e){
    this.setData({
      courseInfo: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
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