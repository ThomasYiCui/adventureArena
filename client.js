var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = "absolute";
var socket = io();
var blocks = [];
var mouseX = 0;
var mouseY = 0;
var client = -1;
var players = 0;
var key = Math.random() * 1000000000
var clicked = false;
var blocks = [];
socket.emit('key', {inputId: "key",state: key});
socket.emit('key', {inputId: "cWidth",state: canvas.width});
socket.emit('key', {inputId: "cHeight",state: canvas.height});

var cRect = canvas.getBoundingClientRect();
function dist(x, y, x2, y2) {
  var a = x - x2;
  var b = y - y2;
  return Math.sqrt(a * a + b * b);
}
function seededRandom(max, min, v) {
  max = max || 1;
  min = min || 0;

  v = (v * 9301 + 49297) % 233280;
  var rnd = v / 233280.0;

  return min + rnd * (max - min);
}
// The higher this value, the less the fps will reflect temporary variations
// A value of 1 will only keep the last value
var filterStrength = 3;
var frameTime = 0, lastLoop = new Date, thisLoop;

// Report the fps only every second, to only lightly affect measurements
var fpsOut = document.getElementById('fps');
setInterval(function(){
  fpsOut = (1000/frameTime).toFixed(1) + " fps";
},1000);
var frameCount = 0;

//^^Connects to the server with socket.io
socket.on('newPositions',function(data){
  socket.emit('key', {inputId: "key",state: key});
  var thisFrameTime = (thisLoop=new Date) - lastLoop;
  frameTime+= (thisFrameTime - frameTime) / filterStrength;
  lastLoop = thisLoop;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(221, 161, 94)";
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  blocks = data[0].blocks;
  projectiles = data[0].projectiles;
  bullets = data[0].bullets;
  soldiers = data[0].soldiers;
  wave = data[0].wave;
  for(var i = 0; i < data.length; i++){
    if(data[i].key == key) {
      client = i;
    }
    if(client >= 10) {
      window.location.replace('https://www.google.com/search?q=to+much+people+try+again+later&rlz=1C1RXQR_enUS1017US1020&oq=to+much+people+try+again+later&aqs=chrome..69i57.7432j1j7&sourceid=chrome&ie=UTF-8');
    }
	}
  if(client != -1) {
    
  }
  if(client != -1 && data[client].scene == "menu") {
    ctx.fillStyle = "black"
    ctx.textAlign = "center";
    ctx.font = "50px Arial";
    ctx.fillText("Adventure Game: Arena Mode", canvas.width/2, canvas.height/2);
    ctx.fillStyle = "rgb(96, 108, 56)"
    ctx.fillRect(canvas.width/2 - 75, canvas.height/2 + 50, 150, 50);
    ctx.fillStyle = "black"
    ctx.font = "25px Arial";
    ctx.fillText("Play", canvas.width/2, canvas.height/2 + 80);
    ctx.fillStyle = "black"
    ctx.font = "25px Arial";
    ctx.fillText("Servers", canvas.width/2 - 300, canvas.height/2 + 40);
  } else if(client != -1 && data[client].scene == "game") {
    camX = data[client].x - canvas.width/2;
    camY = data[client].y - canvas.height/2;
    var x = data[client].x;
    var y = data[client].y;
    for(var i = 0; i < bullets.length; i+=1) {
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.fillRect(bullets[i].x - camX, bullets[i].y - camY, bullets[i].size, bullets[i].size)
    }

    for(var i = 0; i < soldiers.length; i+=1) {
      if(soldiers[i].type == "Lvl. 1") {
        ctx.fillStyle = "rgb(" + seededRandom(0, 255, soldiers[i].id * 500) + ", " + seededRandom(0, 255, soldiers[i].id * 400 + 1) + ", " + seededRandom(0, 255, soldiers[i].id * 300 + 2) + ")";
        ctx.fillRect(soldiers[i].x - camX, soldiers[i].y - camY, soldiers[i].w, soldiers[i].h);
        ctx.fillRect(canvas.width - 215 + soldiers[i].x/30, canvas.height - 315 + soldiers[i].y/30, soldiers[i].w/15, soldiers[i].h/15);
        switch(soldiers[i].wepon) {
          case "Sword":
            ctx.strokeStyle = "rgb(0, 0, 0)";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(soldiers[i].x - camX + soldiers[i].w/2 + Math.cos(soldiers[i].r) * 50, soldiers[i].y - camY + soldiers[i].h/2 + Math.sin(soldiers[i].r) * 50);
            ctx.lineTo(soldiers[i].x - camX + soldiers[i].w/2 + Math.cos(soldiers[i].r) * 90, soldiers[i].y - camY + soldiers[i].h/2 + Math.sin(soldiers[i].r) * 90);
            ctx.stroke();
          break;
        }
      }
      
      ctx.fillStyle = "black";
      ctx.fillRect(soldiers[i].x - camX - 2, soldiers[i].y + soldiers[i].h + 5 - 2 - camY, soldiers[i].w + 4, 9);
      ctx.fillStyle = "green";
      ctx.fillRect(soldiers[i].x - camX, soldiers[i].y + soldiers[i].h + 5 - camY, (soldiers[i].w/soldiers[i].maxHp) * soldiers[i].hp, 5);
    }
    
    // x [0], y [1], aX [2], aY [3], closest [4], hp [5], max hp [6], can jump [7], target x [8]
    for(var i = 0; i < blocks.length; i+=1) {
      // render only when in view
      if(blocks[i].x + blocks[i].w > camX && blocks[i].y + blocks[i].h > camY && blocks[i].x < camX + canvas.width && blocks[i].y < camY + canvas.height) {
        switch(blocks[i].type) {
          case "normal":
            // draw the shadow
            {
            // calculations
            var points = [[blocks[i].x, blocks[i].y], 
                          [blocks[i].x, blocks[i].y + blocks[i].h], 
                          [blocks[i].x + blocks[i].w, blocks[i].y], 
                          [blocks[i].x + blocks[i].w, blocks[i].y + blocks[i].h]];
            var closest = 0;
            var closer = 0;
            var close = 0;
            for(var j = 0; j < points.length; j+=1) {
                if(closest === 0) {
                    closest = points[j];
                } else if(dist(points[j][0], points[j][1], x, y) < dist(closest[0], closest[1], x, y)) {
                    closer = closest;
                    closest = points[j];
                } else if(closer === 0) {
                    closer = points[j];
                } else if(dist(points[j][0], points[j][1], x, y) < dist(closer[0], closer[1], x, y)) {
                    close = closer;
                    closer = points[j];
                } else if(close === 0) {
                    close = points[j];
                } else if(dist(points[j][0], points[j][1], x, y) < dist(close[0], close[1], x, y)) {
                    close = points[j];
                }
                
            }
            if((x > blocks[i].x && x < blocks[i].x + blocks[i].w) || (y > blocks[i].y && y < blocks[i].y + blocks[i].h)) {
              // drawing
              ctx.fillStyle = "rgb(0, 0, 0)"
              ctx.beginPath();
              ctx.moveTo(closest[0] - camX, closest[1] - camY);
              ctx.lineTo(closest[0] + Math.cos(Math.atan2(closest[1] - y, closest[0] - x)) * 100000 - camX, closest[1] + Math.sin(Math.atan2(closest[1] - y, closest[0] - x)) * 100000 - camY);
              ctx.lineTo(closer[0] + Math.cos(Math.atan2(closer[1] - y, closer[0] - x)) * 100000 - camX, closer[1] + Math.sin(Math.atan2(closer[1] - y, closer[0] - x)) * 100000 - camY);
              ctx.lineTo(closer[0] - camX, closer[1] - camY);
              ctx.closePath();
              ctx.fill();
            } else {
              // drawing
              ctx.fillStyle = "rgb(0, 0, 0)"
              ctx.beginPath();
              ctx.moveTo(close[0] - camX, close[1] - camY);
              ctx.lineTo(close[0] + Math.cos(Math.atan2(close[1] - y, close[0] - x)) * 100000 - camX, close[1] + Math.sin(Math.atan2(close[1] - y, close[0] - x)) * 100000 - camY);
              ctx.lineTo(closer[0] + Math.cos(Math.atan2(closer[1] - y, closer[0] - x)) * 100000 - camX, closer[1] + Math.sin(Math.atan2(closer[1] - y, closer[0] - x)) * 100000 - camY);
              ctx.lineTo(closer[0] - camX, closer[1] - camY);
              ctx.closePath();
              ctx.fill();
            }
            }
            
            // draw the block
            ctx.fillStyle = "rgb(188, 108, 37)"
            ctx.fillRect(blocks[i].x - camX, blocks[i].y - camY, blocks[i].w, blocks[i].h);
            ctx.fillStyle = "rgb(155, 50, 50)"
            ctx.fillRect(close[0] - camX, close[1] - camY, 10, 10);
            ctx.fillRect(closer[0] - camX, closer[1] - camY, 10, 10);
            ctx.fillRect(closest[0] - camX, closest[1] - camY, 10, 10);
            ctx.stokeStyle = "rgb(0, 0, 0)";
            ctx.lineWidth = "5px";
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(closest[0], closest[1]);
            ctx.stroke();
          break;
        }
      }
    }
    ctx.textAlign = "center";
    ctx.fillStyle = "black"
    ctx.font = "15px Arial";
    ctx.textAlign = "center";
    for(var i = 0; i < data.length; i++) {
      if(data[i].scene == "game") {
        ctx.fillStyle = "rgb(" + seededRandom(0, 255, data[i].id * 500) + ", " + seededRandom(0, 255, data[i].id * 400 + 1) + ", " + seededRandom(0, 255, data[i].id * 300 + 2) + ")";
        ctx.fillRect(data[i].x - camX, data[i].y - camY, 50, 50);
        ctx.fillRect(canvas.width - 215 + data[i].x/30, canvas.height - 315 + data[i].y/30, 3.3, 3.3);
        ctx.fillStyle = "black"
        ctx.fillRect(data[i].x - 2 - camX, data[i].y + data[i].height + 3 - camY, 54, 9);
        ctx.textAlign = "center"
        ctx.font = "20px Arial";
        ctx.fillText(data[i].saying, data[i].x + 25 - camX, data[i].y - camY - 10);
        ctx.fillStyle = "green";
        ctx.fillRect(data[i].x - camX, data[i].y + data[i].height + 5 - camY, (50/data[i].maxHp) * data[i].hp, 5);
        switch(data[i].inventory[data[i].holding]) {
          case "Sword":
            ctx.strokeStyle = "rgb(100, 100, 100)";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(data[i].x - camX + data[i].width/2 + Math.cos(data[i].r) * 50, data[i].y - camY + data[i].height/2 + Math.sin(data[i].r) * 50);
            ctx.lineTo(data[i].x - camX + data[i].width/2 + Math.cos(data[i].r) * 180, data[i].y - camY + data[i].height/2 + Math.sin(data[i].r) * 180);
            ctx.stroke();
            ctx.strokeStyle = "rgb(101, 67, 33)";
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(data[i].x - camX + data[i].width/2 + Math.cos(data[i].r) * 50, data[i].y - camY + data[i].height/2 + Math.sin(data[i].r) * 50);
            ctx.lineTo(data[i].x - camX + data[i].width/2 + Math.cos(data[i].r) * 60, data[i].y - camY + data[i].height/2 + Math.sin(data[i].r) * 60);
            ctx.stroke();
          break;
        }
      }
    }
    ctx.fillStyle = "black"
    ctx.textAlign = "left";
    ctx.font = "15px Arial";
    ctx.fillText("Players " + data.length, 25, 125);
    ctx.font = "20px Arial";
    ctx.fillText("Lvl " + data[client].lvl, 25, canvas.height - 73);
    for(var i = 0; i < data[client].inventory.length; i+=1) {
      if(data[client].holding == i) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
      } else {
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      }
      ctx.fillRect(8 + i * 72, canvas.height - 72, 70, 70)
      switch(data[client].inventory[i]) {
        case "Sword":
          ctx.strokeStyle = "rgb(100, 100, 100)";
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(23 + i * 72, canvas.height - 17);
          ctx.lineTo(23 + i * 72 + 40, canvas.height - 57);
          ctx.stroke();
        break;
        case "Building Book":
          ctx.fillStyle = "rgb(158, 88, 2)";
          ctx.fillRect(20 + i * 72, canvas.height - 60, 40, 50);
        break;
      }
    }
    ctx.fillStyle = "black";
    ctx.fillRect(canvas.width - 206, canvas.height - 84, 204, 10)
    ctx.fillStyle = "yellow";
    ctx.fillRect(canvas.width - 204, canvas.height - 82, (200/((data[client].lvl + 5) * (data[client].lvl + 5) * 2 + 100)) * data[client].exp, 6);
  }
  
  // Info bar
  ctx.textAlign = "left"
  ctx.fillStyle = "black"
  ctx.font = "20px Arial";
  ctx.fillText(fpsOut, 20, 20);
  if(client >= 0) {
    ctx.fillText("Money: " + data[client].money, 20, 40);
  }

  // Update varibles
  frameCount+=1;
  players = data.length;
  clicked = false;
});
//^^Once the client recieves the position data it clears the canvas and puts all the players in their new positions
document.onkeydown = function(event){
  socket.emit('keyPress', {inputId: "letter", state: event.keyCode});
	if(event.keyCode === 68 || event.keyCode == 39)	//d
		socket.emit('keyPress', {inputId: 'right',state: true});
	else if(event.keyCode === 65 || event.keyCode == 37) //a
		socket.emit('keyPress', {inputId: 'left',state: true});
	else if(event.keyCode === 87 || event.keyCode == 38) // w
		socket.emit('keyPress', {inputId: 'up',state: true});
  else if(event.keyCode === 83 || event.keyCode == 40) // s
		socket.emit('keyPress', {inputId: 'down',state: true});
  else if(event.keyCode === 32) // space
		socket.emit('keyPress', {inputId: 'space',state: true});
};
//^^When a key is pressed it sends this information to the server
document.onkeyup = function(event){
	if(event.keyCode === 68 || event.keyCode == 39)	//d
		socket.emit('keyPress', {inputId: 'right',state: false});
	else if(event.keyCode === 65 || event.keyCode == 37) //a
		socket.emit('keyPress', {inputId: 'left',state: false});
	else if(event.keyCode === 87 || event.keyCode == 38) // w
		socket.emit('keyPress', {inputId: 'up',state: false});
  else if(event.keyCode === 83 || event.keyCode == 40) // s
		socket.emit('keyPress', {inputId: 'down',state: false});
  else if(event.keyCode === 32) // space
		socket.emit('keyPress', {inputId: 'space',state: false});
  else if(event.keyCode === 82) // r
		socket.emit('keyPress', {inputId:'r',state: true});
  else if(event.keyCode === 77) // r
		socket.emit('keyPress', {inputId:'m',state: true});
  else if(event.keyCode === 72) // h
		socket.emit('keyPress', {inputId: 'h',state: true});
  else if(event.keyCode === 70) // f
		socket.emit('keyPress', {inputId:'f',state: true});
  else if(event.keyCode === 69) // e
		socket.emit('keyPress', {inputId:'e',state: true});
  else if(event.keyCode === 66) // b
		socket.emit('keyPress', {inputId:'b',state: true});
  else if(event.keyCode === 66) // t
		socket.emit('keyPress', {inputId:'t',state: true});
  else if(event.keyCode >= 49 && event.keyCode <= 57) // t
		socket.emit('keyPress', {inputId: "numbers", state: event.keyCode - 49});
//^^When a key is released it sends this information to the server
};

canvas.addEventListener("mousemove", function(e) {
  socket.emit('mouse', {inputId:'mouseX',state: Math.round(e.clientX - cRect.left)});
  socket.emit('mouse', {inputId:'mouseY',state: Math.round(e.clientY - cRect.top)});
  mouseX = Math.round(e.clientX - cRect.left);
  mouseY = Math.round(e.clientY - cRect.top);
});
canvas.addEventListener("mouseup", function(e) {
  socket.emit('mouse', {inputId:'clicked',state: true});
  clicked = true;
  dragged = false;
}, false);
canvas.addEventListener("mousedown", function(e) {
  socket.emit('mouse', {inputId:'pressed',state: true});
  dragged = true;
}, false);
