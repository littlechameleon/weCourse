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
    courseInfo: "",
    chapters: "",
    students: "",
    courseId: null,
    stepList: [{
      name: '课程详情'
    }, {
      name: '设置章节'
    }, {
      name: '添加学生'
    }],
    step: 0,
  },

  numSteps: function() {
    if(this.data.step == 2){
      wx.redirectTo({
        url: '../courseHomepage/courseHomepage?courseId=' + this.data.courseId,
      })
    }else{
      this.setData({
        step: this.data.step + 1
      })
    }

  },

  bindtapAddCourse: function(){
    wx.request({
      url: config.service.requestUrl + 'addCourse',
      data: {
        courseInfo: this.data.courseInfo,
        openId: this.data.userInfo.openId,
        avatarUrl: this.data.userInfo.avatarUrl,
      },
      method: 'POST',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if(res.data.code==0){
          this.setData({
            courseId: res.data.data.courseId
          })
          this.numSteps()
        }else{
          util.showModel('添加失败！', '请检查格式是否正确');
          console.log('request fail');
        }
      },
      fail(error) {
        util.showModel('添加失败', error);
        console.log('request fail', error);
      }
    })
  },

  bindtapAddChapter: function () {
    if (this.data.chapters !== '') {
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
            this.numSteps()
          } else {
            util.showModel('添加失败！', '请检查格式是否正确');
            console.log('request fail');
          }
        },
        fail(error) {
          util.showModel('添加失败', error);
          console.log('request fail', error);
        }
      })
    } else {
      util.showModel('添加失败', '请至少添加一个章节');
    }
  },

  bindtapAddStudent: function () {
    if (this.data.students !== '') {
      wx.request({
        url: config.service.requestUrl + 'addStudent',
        data: {
          students: this.data.students,
          courseId: this.data.courseId,
        },
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: res => {
          if (res.data.code == 0) {
            this.numSteps()
          } else {
            util.showModel('添加失败！', '请检查格式是否正确');
            console.log('request fail');
          }
        },
        fail(error) {
          util.showModel('添加失败', error);
          console.log('request fail', error);
        }
      })
    } else {
      util.showModel('添加失败', '请至少添加一个学生');
    }
  },

  bindinputCourse: function(e){
    this.setData({
      courseInfo: e.detail.value
    })
  },

  bindinputChapter: function (e) {
    this.setData({
      chapters: e.detail.value
    })
  },

  bindinputStudent: function (e) {
    this.setData({
      students: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      step: parseInt(options.step),
    })
    if(this.data.step != 0){
      this.setData({
        courseId: options.courseId
      })
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