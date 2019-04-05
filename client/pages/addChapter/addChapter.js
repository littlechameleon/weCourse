// pages/addChapter/addChapter.js
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    chapters: "",
    courseId: "",
  },

  bindtapcreate: function () {
    if(this.data.chapters!==''){
      wx.request({
        url: config.service.requestUrl + 'addChapter',
        data: {
          chapters: this.data.chapters,
          courseId: this.data.courseId,
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: res => {
          if (res.data.code == 0) {
            util.showSuccess('章节添加成功！')
            wx.redirectTo({
              url: '../addStudent/addStudent?courseId=' + this.data.courseId,
            })
          } else {
            util.showModel('添加失败！', '添加失败，请检查格式是否正确');
            console.log('request fail');
          }
        },
        fail(error) {
          util.showModel('添加失败', error);
          console.log('request fail', error);
        }
      })
    }else{
      util.showModel('添加失败', '请至少添加一个章节');
    }
  },

  bindinput: function (e) {
    this.setData({
      chapters: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      courseId: options.courseId
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