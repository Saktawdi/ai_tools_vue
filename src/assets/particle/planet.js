var ctx;
var w;
var h;
var comets = [];

function Comet() {
  this.x = w;
  this.y = Math.random() * h;
  this.size = Math.random() * 20 + 10;
  this.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
  this.xSpeed = -Math.random() * 5 - 1;
  this.ySpeed = (Math.random() - 0.5) * 2;
}
Comet.prototype.show = function () {
  this.x += this.xSpeed;
  this.y += this.ySpeed;

  if (this.x + this.size < 0) {
    this.reset();
  }

  drawComet(this.x, this.y, this.size, this.color,this.xSpeed);
};
Comet.prototype.reset = function () {
  this.x = w;
  this.y = Math.random() * h;
  this.size = Math.random() * 20 + 100;
  this.color = "#" + parseInt(Math.random() * 0xffffff).toString(16);
  this.xSpeed = -Math.random() * 5 - 1;
  this.ySpeed = (Math.random() - 0.5) * 2;
};
//尾迹
function drawComet(x, y, size, color,xSpeed) {
  // console.log(xSpeed)
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - size +xSpeed , y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();
  drawCometTail(x - size, y, color);
}
//球
function drawCometTail(x, y, color) {
  for (var i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(x, y, i * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
function start() {
  setInterval(addComet, 2000);
  setInterval(drawComets, 30);
}
function addComet() {
    if (comets.length < 20) { //粒子个数
        var comet = new Comet();
        comets.push(comet);
    }
}
function drawComets() {
  ctx.clearRect(0, 0, w, h);
  for (var i = 0; i < comets.length; i++) {
    comets[i].show();
  }
}
function init(ctx1, w1, h1) {
  ctx = ctx1;
  w = w1;
  h = h1;
}

export { init, start };
