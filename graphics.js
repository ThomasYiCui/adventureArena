var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function woodBlock(x, y, s) {
  ctx.fillStyle = "rgb(145, 117, 61)"
  ctx.fillRect(x, y, s, s);
}
function apple(x, y, s) {
  ctx.fillStyle = "rgb(255, 0, 0)"
  ctx.beginPath();
  ctx.ellipse(x + s/2, y + s/2, s/2, s/2, 0, -Math.PI * 2, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgb(168, 109, 50)"
  ctx.beginPath();
  ctx.moveTo(x + s/2 + 5, y - 10);
  ctx.lineTo(x + s/2, y + 5)
  ctx.stroke();
  ctx.fillStyle = "rgb(10, 191, 19)"
  ctx.beginPath();
  ctx.ellipse(x + s/2 - 5, y - 5, 10, 5, 0.45, -Math.PI * 2, Math.PI * 2);
  ctx.fill();
}
function turret(x, y, s, tX, tY) {
  ctx.fillStyle = "rgb(150, 150, 150)"
  ctx.fillRect(x - 10, y + 10, s, s - 10);
  ctx.fillStyle = "rgb(120, 120, 120)"
  ctx.beginPath();
  ctx.ellipse(x + s/2 - 10, y + 10, s/2 - 2, s/2 - 2, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "rgb(120, 120, 120)"
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(x + s/2 - 10, y + 10);
  ctx.lineTo(x - 10 + s/2 + Math.cos(Math.atan2(y - tX, x - tX) - Math.PI) * 30, y + 10 + Math.sin(Math.atan2(y - tX, x - tX) - Math.PI) * 30)
  ctx.stroke();
}
function barrack(x, y, s) {
  var t = s/10
  // the triangle
  ctx.fillStyle = "rgb(0, 0, 255)"
  ctx.beginPath();
  ctx.moveTo(x + t, y + s);
  ctx.lineTo(x + t * 7, y + s - t * 12);
  ctx.lineTo(x + t * 13, y + s);
  ctx.closePath();
  ctx.fill()

  // the triangle
  ctx.fillStyle = "rgb(0, 0, 0)"
  ctx.beginPath();
  ctx.moveTo(x + t * 5, y + s);
  ctx.lineTo(x + t * 7, y + s - t * 10);
  ctx.lineTo(x + t * 9, y + s);
  ctx.closePath();
  ctx.fill()
}
