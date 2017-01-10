//index.js
//获取应用实例
// 指南针：有两种使用形式，一、指针不动永远指向你面对的方向，罗盘动；二、罗盘不动，指针动，上北下南，左西右东。
var app = getApp();
var wezrender = require('../../lib/wezrender');
var utils = require('../../utils/util');
var zr = null;

Page({
  data: {
    pixelRatio:0,
    width:0,
    height:0,
    canvasWidth:0,
    canvasHeight:0,
    radius:0,
    circleX:0,
    circleY:0,
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
    var leftHeight = that.data.height-70;
    var radius = that.data.width*0.35;
    if(that.data.width>(leftHeight+50)){
      radius = (leftHeight-50)/2;
    }
    var circleX = that.data.width/2;
    var circleY = (that.data.height-35-radius)/2;
    that.setData({
        canvasWidth:that.data.width,
        canvasHeight:leftHeight,
        radius:radius,
        circleX:circleX,
        circleY:circleY
    });

    //////开始画圆形罗盘了。
    zr = wezrender.zrender.init("compass_canvas", that.data.width, leftHeight);
    var gradient = new wezrender.graphic.LinearGradient();
    gradient.addColorStop(0, '#A8A7AD');
    gradient.addColorStop(1, '#A8A7AD');

    var circle = new wezrender.graphic.shape.Circle({
        shape: {
            cx: circleX,
            cy: circleY,
            r: radius
        },
        style: {
            stroke:"#28A7AD",
            fill: gradient,
            lineWidth: 3
        }
    });
    zr.add(circle);
    that.drawDirectionText();
    that.drawScaleDialLine();

    // circle.animate('shape').when(200, {
    //     cx: 250
    // }).start();
            
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
  drawScaleDialLine:function(){
    var that = this;
    var startX=0,startY=0,endX=0,endY=0;
    for(var i=1;i<=16;i++){ //分8个刻度
      var lineColor = "#60E477";
      var offset = 40;
      var angle = i*22.5;
      if(Math.abs(Math.sin(angle*0.017453293))>0.99){
        // startX = that.data.circleX+(that.data.radius-40)*Math.sin(angle* 0.017453293);
        // startY = that.data.circleY;
        // endX = that.data.circleX+(that.data.radius)*Math.sin(angle* 0.017453293);
        // endY = that.data.circleY;
      }else if(Math.abs(Math.cos(angle*0.017453293))>0.99){
        // startX = that.data.circleX;
        // startY = that.data.circleY-(that.data.radius-40)*Math.cos(angle* 0.017453293);
        // endX = that.data.circleX;
        // endY = that.data.circleY-(that.data.radius)*Math.cos(angle* 0.017453293);
      }else{
        startX = that.data.circleX+(that.data.radius-20)*Math.sin(angle* 0.017453293);
        startY = that.data.circleY-(that.data.radius-20)*Math.cos(angle* 0.017453293);
        endX = that.data.circleX+(that.data.radius)*Math.sin(angle* 0.017453293);
        endY = that.data.circleY-(that.data.radius)*Math.cos(angle* 0.017453293);
        lineColor="#786E7B";
        offset = 20;
      } 
      angle+=45;//便偏移0度角。
      
        startX = that.data.circleX+(that.data.radius-offset)*Math.sin(angle* 0.017453293);
        startY = that.data.circleY-(that.data.radius-offset)*Math.cos(angle* 0.017453293);
        endX = that.data.circleX+(that.data.radius)*Math.sin(angle* 0.017453293);
        endY = that.data.circleY-(that.data.radius)*Math.cos(angle* 0.017453293);
      utils.drawLine(zr,wezrender,startX,startY,endX,endY,lineColor);
    }
  },
  drawDirectionText:function(){ //画东南西北四个方向的文字。
    var that = this;
    utils.drawText(zr,wezrender,that.data.circleX-12,that.data.circleY-that.data.radius-6,"北");
    utils.drawText(zr,wezrender,that.data.circleX-12,that.data.circleY+that.data.radius+22,"南");
    utils.drawText(zr,wezrender,that.data.circleX+that.data.radius,that.data.circleY+6,"东");
    utils.drawText(zr,wezrender,that.data.circleX-that.data.radius-26,that.data.circleY+6,"西");
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
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
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
