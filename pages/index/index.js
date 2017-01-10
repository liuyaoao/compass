//index.js
//获取应用实例
// 指南针：有两种使用形式，一、指针不动永远指向你面对的方向，罗盘动；二、罗盘不动，指针动，上北下南，左西右东。
var app = getApp();
var wezrender = require('../../lib/wezrender');
var zr = null;

Page({
  data: {
    pixelRatio:0,
    width:0,
    height:0,
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    that.getDeviceSystemInfo();
    //////////
    zr = wezrender.zrender.init("compass_canvas", 300, 300);

    var gradient = new wezrender.graphic.LinearGradient();
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'red');

    var circle = new wezrender.graphic.shape.Circle({
        shape: {
            cx: 150,
            cy: 150,
            r: that.data.width*0.35
        },
        style: {
            fill: gradient,
            lineWidth: 10
        }
    });
    zr.add(circle);

        // circle.animate('shape').when(200, {
        //         cx: 250
        //     }).start();
            
        // circle.animate('shape', true).when(1000, {
        //         cx: 250
        //     }).when(2000, {
        //         cx: 250,
        //         cy: 250
        //     }).when(3000, {
        //         cx: 50,
        //         cy: 250
        //     }).when(4000, {
        //         cx: 150,
        //         cy: 150
        //     }).start();
    ///////////
  },
  getDeviceSystemInfo:function(){
    var that = this;
    try {
      var res = wx.getSystemInfoSync();
      that.setData({
        pixelRatio:res.pixelRatio,
        width:res.windowWidth,
        height:res.windowHeight,
      });
      // console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      // console.log(res.language)
      // console.log(res.version)
      // console.log(res.platform)
    } catch (e) {
      // Do something when catch error
    }
  },
  onUnload:function(){  
      if (zr)  {
          zr.dispose();
      }
    }
})
