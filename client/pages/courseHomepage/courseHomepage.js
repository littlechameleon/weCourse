// pages/courseHomepage/courseHomepage.js
var config = require('../../config')
var util = require('../../utils/util.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo: {},
    courseId: "",
    chapterList: [],
    course: {},
    chapter: -1,
    signState: 0,   //点名开启状态
    checkState: 0,  //是否签到状态
    signIn: null,
    isTeacher: 0,
    imgSrc: null,
  },

  bindtapFeedback: function(){
    wx.navigateTo({
      url: '../feedback/feedback?courseId=' + this.data.courseId + '&isTeacher=' + this.data.isTeacher,
    })
  },

  bindtapDataCollect: function () {
    wx.navigateTo({
      url: '../dataCollect/dataCollect?courseId=' + this.data.courseId + '&isTeacher=' + this.data.isTeacher,
    })
  },

  bindtapQuiz: function(){
    if(this.data.isTeacher==1){
      wx.navigateTo({
        url: '../quiz/quiz?courseId=' + this.data.courseId + '&isTeacher=' + this.data.isTeacher,
      })
    }else{
      wx.navigateTo({
        url: '../quizHistory/quizHistory?courseId=' + this.data.courseId + '&isTeacher=' + this.data.isTeacher,
      })
    }
  },

  bindtaptest: function(){
    if(this.data.chapter==-1){
      util.showModel('操作失败','请先选择章节');
    }else{
      let isTeacher = this.data.isTeacher
      let chapter =this.data.chapterList[this.data.chapter]
      wx.navigateTo({
        url: '../test/test?chapterId=' + chapter.chapter_id + '&sequence=' + chapter.sequence + '&title=' + chapter.title + '&isTeacher=' + isTeacher,
      })
    }
  },

  bindtapSignIn: function(){
    if (this.data.chapter == -1) {
      util.showModel('操作失败', '请先选择章节');
    } else {
      let isTeacher = this.data.isTeacher
      let chapter = this.data.chapterList[this.data.chapter]
        wx.request({
          url: config.service.requestUrl + 'getSignIn',
          data: {
            chapterId: chapter.chapter_id,
          },
          success: res => {
            if (res.data.code == 0) {
              this.setData({
                signIn: res.data.data.signIn
              })
              if (this.data.signIn && this.data.signIn.state == 2) {
                wx.navigateTo({
                  url: '../signInResult/signInResult?chapterId=' + chapter.chapter_id + '&sequence=' + chapter.sequence + '&title=' + chapter.title + '&isTeacher=' + isTeacher,
                })
              } else if (!this.data.signIn && isTeacher == 0){
                util.showModel('fail' ,'签到未开启！')
              }else{
                wx.navigateTo({
                  url: '../signIn/signIn?chapterId=' + chapter.chapter_id + '&sequence=' + chapter.sequence + '&title=' + chapter.title + '&isTeacher=' + isTeacher,
                })
              }
            }
            else {
              util.showModel('fail', '签到结果获取失败！');
              console.log('request fail');
            }
          },
          fail: error => {
            util.showModel('签到结果获取失败', error);
            console.log('request fail', error);
          }
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
      imgSrc: "https://ossweb-img.qq.com/images/lol/web201310/skin/big1000" + options.courseId%10 + ".jpg"
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
          if (this.data.userInfo.openId === this.data.course.teacher_id) {
            this.setData({
              isTeacher: 1,
            })
          }
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