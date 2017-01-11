function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
// 画文本
function drawText(zr,wezrender,x,y,text){
  var text = new wezrender.graphic.Text({
            style: {
                x: x,
                y: y,
                text: text,
                width: 30,
                height: 30,
                fill: '#cc00ff',
                // rotation:[20,0,0],
                textAlign:"center",
                textFont: '24px Microsoft Yahei',
                textBaseline: 'middle'
            }
        });
        zr.add(text);
        return text;
}
// 画直线条条。
function drawLine(zr,wezrender,x1,y1,x2,y2,lineColor){
  var line = new wezrender.graphic.shape.Line({
            shape: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2
            },
            style: {
                lineCap: "round",                   
                lineWidth: 3,
                stroke: lineColor,
            }

        });
        zr.add(line);
        return line;
}

// 扩展zrender图形。自定义图形对象。
function getCustomGraphPin(wezrender,rotx,roty){
  var Pin = wezrender.graphic.Path.extend({
            type: 'pin',
            shape: {
                // x, y on the cusp
                x: 0,
                y: 0,
                width: 0,
                height: 0,
            },
            rotation:[7,rotx,roty],
            buildPath: function (path, shape) {
                var x = shape.x;
                var y = shape.y;
                var w = shape.width / 5 * 3;
                // Height must be larger than width
                var h = Math.max(w, shape.height);
                var r = w / 2;
                // Dist on y with tangent point and circle center
                var dy = r * r / (h - r);
                var cy = y - h + r + dy;
                var angle = Math.asin(dy / r);
                // Dist on x with tangent point and circle center
                var dx = Math.cos(angle) * r;

                var tanX = Math.sin(angle);
                var tanY = Math.cos(angle);

                path.arc(
                    x, cy, r,
                    Math.PI - angle,
                    Math.PI * 2 + angle
                );

                var cpLen = r * 0.6;
                var cpLen2 = r * 0.7;
                path.bezierCurveTo(
                    x + dx - tanX * cpLen, cy + dy + tanY * cpLen,
                    x, y - cpLen2,
                    x, y
                );
                path.bezierCurveTo(
                    x, y - cpLen2,
                    x - dx + tanX * cpLen, cy + dy + tanY * cpLen,
                    x - dx, cy + dy
                );
                path.closePath();
            }
        });
        return Pin;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  drawText: drawText,
  drawLine:drawLine,
  getCustomGraphPin:getCustomGraphPin
}
