// pages/quiz/quiz.js
var config = require('../../config')
var util = require('../../utils/util.js')
var pinyin = require('../../utils/pinyin.js')

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
    studentList: null,
    sortedStudentList: null,
    score: 0,
    student: null,
    hidden: true,
    dialogShow: false,
    score: 0,
  },

  bindtapMark: function(e){
    this.setData({
      score: e.currentTarget.dataset.id + 1
    })
  },

  hideModal: function(){
    this.setData({
      dialogShow: false,
      score: 0,
    })
  },

  getStudentList: function(){
    wx.request({
      url: config.service.requestUrl + 'getStudentList',
      data: {
        courseId: this.data.courseId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            studentList: res.data.data.studentList,
            sortedStudentList: pinyin.getPyData(res.data.data.studentList, 0)
          })
        }
        else {
          util.showModel('fail', '学生列表获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('学生列表获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  chooseRandomStudent: function(){
    let length = this.data.studentList.length
    let index = parseInt(Math.random()*length)
    this.setData({
      student: this.data.studentList[index],
      dialogShow:true,
    })
  },

  bindtapChooseStudent: function(e){
    let data = e.currentTarget.dataset
    this.setData({
      student: this.data.sortedStudentList[this.data.list[data.index]][data.sub],
      dialogShow:true,
    })
  },

  addQuiz: function () {
    if(this.data.student.open_id == null){
      util.showModel('fail','该同学还未注册')
    }
    wx.request({
      url: config.service.requestUrl + 'addQuiz',
      data: {
        courseId: this.data.courseId,
        openId: this.data.student.open_id,
        score: this.data.score,
      },
      success: res => {
        if (res.data.code == 0) {
          util.showSuccess('操作成功')
          this.hideModal()
        }
        else {
          util.showModel('fail', '评分上传失败')
          console.log('request fail')
        }
      },
      fail: error => {
        util.showModel('评分上传失败', error)
        console.log('request fail', error)
      }
    })
  },

  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
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
    this.getStudentList()
  
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }
    this.setData({
      list: list,
      listCur: list[0],
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  bindtapQuizHistory:function(){
    wx.navigateTo({
      url: '../quizHistory/quizHistory?courseId=' + this.data.courseId + '&isTeacher=' + this.data.isTeacher,
    })
  },

  onReady: function () {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
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