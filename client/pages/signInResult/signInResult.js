// pages/signInResult/signInResult.js
var config = require('../../config')
var util = require('../../utils/util.js')
import * as echarts from '../../ec-canvas/echarts'

const app = getApp()

var signIn = null
function setOption(chart) {
  const option = {
    // title:{
    //   text: '签到结果',
    //   left: 'center',
    //   top: 'top',
    //   textStyle:{
    //     fontSize: 16
    //   }
    // },
    textStyle: {
      fontSize: 16
    },
    tooltip:{
      position: function (pos, params, dom, rect, size) {
        // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
        var obj = { top: 60 };
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
        return obj;
      },
      textStyle:{
        fontSize: 18
      },
      formatter:'{b}: {c} ({d}%)'
    },
    legend:{
      data: ['已签到','未签到'],
      textStyle:{
        fontSize: 18
      }
    },
    backgroundColor: "#ffffff",
    color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
    series: [{
      label: {
        normal: {
          fontSize: 16
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: [0, '60%'],
      data: [{
        value: signIn.number,
        name: '已签到'
      }, {
        value: signIn.absent,
        name: '未签到'
      }
      ],
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 2, 2, 0.3)'
        }
      }
    }]
  };

  chart.setOption(option);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ecPie:{
      lazyLoad: true
    },
    sequence: 0,
    userInfo: {},
    isTeacher: 0,
    title: "",
    chapterId: -1,
    signIn: null,
    checkIn: null,
    checkState: '×',
    unCheckIn: null,
  },

  init: function(){
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart)

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      chapterId: options.chapterId,
      isTeacher: options.isTeacher,
      sequence: parseInt(options.sequence),
      title: options.title,
    })
    this.getSignIn()
    if(this.data.isTeacher == 0){
      this.getCheckIn()
    }else{
      this.getUncheckIn()
    }
  },

  getCheckIn: function(){
    wx.request({
      url: config.service.requestUrl + 'getCheckIn',
      data: {
        chapterId: this.data.chapterId,
        openId: this.data.userInfo.openId,
      },
      success: res => {
        if (res.data.code == 0) {
          let checkIn = res.data.data.checkIn
          if(checkIn){
            this.setData({
              checkIn: res.data.data.checkIn,
              checkState: '√',
            })
          }
        }
        else {
          util.showModel('fail', '签到结果获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('签到结果获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  getUncheckIn: function(){
    wx.request({
      url: config.service.requestUrl + 'getUncheckIn',
      data: {
        chapterId: this.data.chapterId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            unCheckIn: res.data.data.unCheckIn
          })
        }
        else {
          util.showModel('fail', '签到结果获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('签到结果获取失败', error);
        console.log('request fail', error);
      }
    })
  },

  

  getSignIn: function(){
    wx.request({
      url: config.service.requestUrl + 'getSignIn',
      data: {
        chapterId: this.data.chapterId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            signIn: res.data.data.signIn
          })
          signIn = res.data.data.signIn
          this.ecComponent = this.selectComponent('#mychart-dom-pie')
          this.init()
        }
        else {
          util.showModel('fail', '签到结果获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('签到结果获取失败', error);
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