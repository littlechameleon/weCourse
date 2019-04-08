// pages/testResult/testResult.js
var config = require('../../config')
var util = require('../../utils/util.js')
import * as echarts from '../../ec-canvas/echarts'

const app = getApp()

function setOption(chart, data) {
  const option = {
    textStyle:{
      fontSize: 16
    },
    color: ['#37a2da', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        name: '人数',
        axisLabel: {
          color: '#666'
        }
      }
    ],
    xAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        name: '选项',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '人数',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside',
          }
        },
        data: data,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
    ]
  };
  chart.setOption(option);
}

function setOptionBar(chartBar, data) {
  let scores = []
  let name = []
  for(let index in data){
    scores.push(data[index].score)
    name.push(data[index].name)
  }
  const optionBar = {
    textStyle: {
      fontSize: 16
    },
    color: ['#ff6600', '#32c5e9', '#67e0e3'],
    tooltip: {
      trigger: 'axis',
      show: false,
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#999'
          }
        },
        name: '名字',
        data: name,
        axisLabel: {
          color: '#666'
        }
      }
    ],
    xAxis: [
      {
        type: 'value',
        name: '分数',
        show: false,
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '分数',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside',
          }
        },
        data: scores,
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
    ]
  };
  chartBar.setOption(optionBar);
}

function initChart(canvas, width, height, data) {
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    setOption(chart, data);

    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    this.chart = chart;

    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
}

function initChartBar(canvas, width, height, data) {
  // 获取组件的 canvas、width、height 后的回调函数
  // 在这里初始化图表
  const chartBar = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  setOptionBar(chartBar, data);

  // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
  this.chartBar = chartBar;

  // 注意这里一定要返回 chart 实例，否则会影响事件处理等
  return chartBar;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    ecBar: {
      onInit: initChartBar
    },
    question: [],
    result: [],
    sequence: 0,
    result: [],
    radioList: [],
    testId: "",
    userInfo: {},
    test: {},
    distribution: [],
    isTeacher: 0,
    scores: [],
    title: "",
    answer: Object,
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      testId: options.testId,
      sequence: parseInt(options.sequence),
      title: options.title,
      isTeacher: options.isTeacher,
    })
    wx.request({
      url: config.service.requestUrl + 'getTest',
      data: {
        testId: this.data.testId,
      },
      success: res => {
        if (res.data.code == 0) {
          this.setData({
            test: res.data.data.test,
            question: res.data.data.question,
          })
          let question = this.data.question
          let radioList = []
          let result = []
          let distribution = []
          for (let index in question) {
            let singleResult = []
            let radiosPart = question[index].radio.split('>')
            distribution.push(question[index].distribution.split(','))
            radioList.push(radiosPart)
            if (question[index].type == 0) {
              singleResult[parseInt(question[index].result)] = 1
              result.push(singleResult)
            }
            else {
              for (let idx in question[index].result) {
                singleResult[parseInt(question[index].result[idx])] = 1
              }
              result.push(singleResult)
            }
          }
          this.setData({
            distribution: distribution,
            radioList: radioList,
            result: result,
          })
          wx.request({
            url: config.service.requestUrl + 'getTestResult',
            data: {
              testId: this.data.testId,
              isTeacher : this.data.isTeacher,
              openId: this.data.userInfo.openId,
            },
            success: res => {
              if (res.data.code == 0) {
                  if(this.data.isTeacher != 0){
                    this.setData({
                      scores: res.data.data.scores
                    })
                  }
                  else{
                    this.setData({
                      scores: res.data.data.scores,
                      answer: res.data.data.answer
                    })
                  }
              }
              else {
                util.showModel('fail', '测试结果获取失败');
                console.log('request fail');
              }
            },
            fail: error => {
              util.showModel('测试结果获取失败', error);
              console.log('request fail', error);
            }
          })
        }
        else {
          util.showModel('fail', '测试题目获取失败');
          console.log('request fail');
        }
      },
      fail: error => {
        util.showModel('测试题目获取失败', error);
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