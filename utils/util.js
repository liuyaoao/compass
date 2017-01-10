function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function drawText(zr,wezrender,x,y,text){
  var text = new wezrender.graphic.Text({
            style: {
                x: x,
                y: y,
                text: text,
                width: 30,
                height: 30,
                fill: '#cc00ff',
                rotation:[20,0,0],
                textFont: '24px Microsoft Yahei',
                textBaseline: 'top'
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

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  drawText: drawText,
  drawLine:drawLine
}
