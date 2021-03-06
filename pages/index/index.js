//index.js
//获取应用实例
// 指南针：有两种使用形式，一、指针不动永远指向你面对的方向，罗盘动；二、罗盘不动，指针动，上北下南，左西右东。
var app = getApp();
var wezrender = require('../../lib/wezrender');
var utils = require('../../utils/util');
var zr = null,zr_pointer = null;
var pointerCtx = null;

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
    scaleDialArr:[],
    directionTextMap:{},
    rotateDegree:0,
    animationData: {},
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
    that.getDeviceSystemInfo(); //获取设备的系统信息。
    var leftHeight = that.data.height-70;
    var radius = that.data.width*0.35;
    if(that.data.width>(leftHeight+50)){
      radius = (leftHeight-50)/2;
    }
    var circleX = that.data.width/2;
    var circleY = (that.data.height-radius+6)/2;
    that.setData({
        canvasWidth:that.data.width,
        canvasHeight:leftHeight,
        radius:radius,
        circleX:circleX,
        circleY:circleY
    });
    pointerCtx = wx.createCanvasContext('compassPointer_canvas');
    //开始画圆形罗盘了。
    zr = wezrender.zrender.init("compass_canvas", that.data.width, leftHeight);
    zr_pointer = wezrender.zrender.init("compassPointer_canvas", 30, 80);
    // var gradient = new wezrender.graphic.LinearGradient();
    // gradient.addColorStop(0, '#A8A7AD');
    // gradient.addColorStop(1, '#A8A7AD');
    var circle = new wezrender.graphic.shape.Circle({
        shape: {
            cx: circleX,
            cy: circleY,
            r: radius
        },
        style: {
            stroke:"#28A7AD",
            fill: "#E2DEDE",
            lineWidth: 3
        }
    });
    zr.add(circle);
    
    that.drawScaleDial(0);
    var Pin = utils.getCustomGraphPin(wezrender,that.data.circleX,that.data.circleY);
    that.drawPinPointer(Pin);

    pointerCtx.translate(80, 80);//这句是把指针的原点移到圆盘的中心点点。
    pointerCtx.rotate(180 * Math.PI / 180); //这句是把指针倒转一下，使指针尖的一头指向外面。
    // pointerCtx.rotate(270 * Math.PI / 180)
    pointerCtx.draw();

    var flag = 0;
    wx.onCompassChange(function (res) {
      if(flag%10 == 0){
      
        that.drawScaleDial(360-res.direction,true);
        // pointerCtx.translate(80, 80);
        // pointerCtx.rotate(180 * Math.PI / 180);
        // pointerCtx.rotate((360-res.direction) * Math.PI / 180)
        // pointerCtx.draw();
      }
      flag++;
      if(flag == 100000000000){
        flag=0;
      }
    });
  },
  // 画盘刻度和方向文字。
  drawScaleDial:function(offsetAngle,isUpdate){
    var that = this;
    
    var isUpdate = isUpdate || false;
    var startX=0,startY=0,endX=0,endY=0;
    for(var i=1;i<=16;i++){ //分16个刻度
      var lineColor = "#60E477";
      var offset = 40;
      var angle = i*22.5;
      if(Math.abs(Math.sin(angle*0.017453293))>0.99){
        if(Math.sin(angle*0.017453293) > 0.99){
          that.drawDirectionText(angle+offsetAngle,"东",isUpdate);
        }else if(Math.sin(angle*0.017453293) < -0.99){
          that.drawDirectionText(angle+offsetAngle,"西",isUpdate);
        }
      }else if(Math.abs(Math.cos(angle*0.017453293))>0.99){
        if(Math.cos(angle*0.017453293) > 0.99){
          that.drawDirectionText(angle+offsetAngle,"北",isUpdate);
        }else if(Math.cos(angle*0.017453293) < -0.99){
          that.drawDirectionText(angle+offsetAngle,"南",isUpdate);
        }
      }else{
        lineColor="#786E7B";
        offset = 20;
      } 
      var tempAngle = angle+offsetAngle;//加上偏移度角。
      startX = that.data.circleX+(that.data.radius-offset)*Math.sin(tempAngle* 0.017453293);
      startY = that.data.circleY-(that.data.radius-offset)*Math.cos(tempAngle* 0.017453293);
      endX = that.data.circleX+(that.data.radius)*Math.sin(tempAngle* 0.017453293);
      endY = that.data.circleY-(that.data.radius)*Math.cos(tempAngle* 0.017453293);
      if(isUpdate){
        that.data.scaleDialArr[i-1].animate('shape').when(10, {
            x1:startX,
            y1:startY,
            x2:endX,
            y2:endY
        }).start();
      }else{
        // console.log("startx,starty,endx,endy:"+startX+","+startY+","+endX+","+endY);
        that.data.scaleDialArr[i-1] = utils.drawLine(zr,wezrender,startX,startY,endX,endY,lineColor);
      }
    }
  },
  drawDirectionText:function(tempAngle,direction,isUpdate){ //画东南西北四个方向的文字。
    var that = this;
    var tx = that.data.circleX+(that.data.radius)*Math.sin(tempAngle* 0.017453293);
    var ty = that.data.circleY-(that.data.radius)*Math.cos(tempAngle* 0.017453293);
    tx += (15)*Math.sin(tempAngle* 0.017453293);
    ty -= (15)*Math.cos(tempAngle* 0.017453293);
    tx -= 12;
    ty += 8;
    if(isUpdate){
        that.data.directionTextMap[direction].animate('style').when(10, {
            x:tx,
            y:ty
        }).start();
      }else{
        that.data.directionTextMap[direction] = utils.drawText(zr,wezrender,tx,ty,direction);
      }
  },
  //画指针。
  drawPinPointer:function(Pin){
    var that = this;
    var pin = new Pin({
        shape: {
            x: 0,
            y: 80,
            width: 30,
            height: 80
        },
        scale: [1, 1,0,0]
    });
    zr_pointer.add(pin);
  },
  //获取设备的系统信息。
  getDeviceSystemInfo:function(){
    var that = this;
    try {
      var res = wx.getSystemInfoSync();
      that.setData({
        pixelRatio:res.pixelRatio,
        width:res.windowWidth,
        height:res.windowHeight-120,
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
  openLocationMap:function(){
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28
        })
      }
    });
  },
  onUnload:function(){  
      if (zr)  {
          zr.dispose();
      }
    }
})
