// pages/courseHomepage/courseHomepage.js
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    courseId: "",
    chapterList: [],
    course: {},
    chapter: -1,
  },

  bindtaptest: function(){
    if(this.data.chapter==-1){
      util.showModel('操作失败','请先选择章节');
    }else{
      let isTeacher = this.data.userInfo.openId === this.data.course.teacher_id ? 1 : 0
      let chapter =this.data.chapterList[this.data.chapter]
      wx.navigateTo({
        url: '../test/test?chapterId=' + chapter.chapter_id + '&sequence=' + chapter.sequence + '&title=' + chapter.title + '&isTeacher=' + isTeacher,
      })
    }
  },

  bindchange: function(e){
    this.setData({
      chapter: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      courseId: options.courseId,
    }),
    wx.request({
      url: config.service.requestUrl + 'getCourseInfo',
      data: {
        courseId : this.data.courseId,
      },
      success: res=>{
        if(res.data.code==0){
          this.setData({
            chapterList: res.data.data.chapterList,
            course: res.data.data.course,
          })
        }
        else{
          util.showModel('fail', '课程信息获取失败');
          console.log('request fail');
        }
      },
      fail: error=>{
        util.showModel('课程信息获取失败', error);
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