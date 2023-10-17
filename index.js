
const weponTypes = {
  "Sword": {
    reload: 10,
    bullet: "Basic",
    spread: 0.05,
    length: 70,
  },
  "Lead Sword": {
    reload: 13,
    bullet: "Lead",
    spread: 0.025,
    length: 70,
  },
  "Ak-47": {
    reload: 3,
    bullet: "Ak-47 Bullet",
    spread: 0.15,
    length: 140,
  },
  "M-16": {
    reload: 2,
    bullet: "Ak-47 Bullet",
    spread: 0.1,
    length: 140,
  }
}
// 账号Cc1Nj7Qm7Sf4密码Pc7Iw5Gg7Xc4
// https://downloads.khinsider.com/game-soundtracks/album/my-singing-monsters-vol.-2-original-game-soundtrack-2021/13.%2520Earth%2520Island%2520%2528feat.%2520Werdos%2520%2526%2520Dipsters%2529.mp3
/** 
  IMPROVE PERFORMANCE
  - Reduce message size and frequency (Don't send block info if not changed, don't send player data if not in game)
  - Chache frequently used information (Blocks)
  - More efficient functions
  IMPORVE CHANNEL
  - Post on other sites
  - Find a neice with little competition 
  - Title and description are key when starting at zero (USE DESCRIPTION)
*/
function dist(x, y, x2, y2) {
  var a = x - x2;
  var b = y - y2;
  return Math.sqrt(a * a + b * b);
}

function bullet(x, y, r, type, id) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.type = type;
  this.id = id;
  switch(this.type) {
    case "Basic":
      this.dmg = 15;
      this.spd = 30;
      this.size = 5;
      this.life = 1000;
      this.hitDecay = 1000;
      this.knockBack = 10;
    break;
    case "Ak-47 Bullet":
      this.dmg = 40;
      this.spd = 30;
      this.size = 5;
      this.life = 1000;
      this.hitDecay = 1000;
      this.knockBack = 10;
    break;
    case "Lead":
      this.dmg = 15;
      this.spd = 20;
      this.size = 7;
      this.life = 800;
      this.hitDecay = 230;
      this.knockBack = 10;
    break;
    case "Admin Bullet 1":
      this.dmg = 10;
      this.spd = 30;
      this.size = 10;
      this.life = 500;
      this.hitDecay = 500;
      this.knockBack = 1;
    break;
    case "Admin Bullet 2":
      this.dmg = 10000;
      this.spd = 30;
      this.size = 20;
      this.life = 10000;
      this.hitDecay = 10000;
      this.knockBack = 10;
    break;
    case "Shotgun Pellet":
      this.dmg = 5;
      this.spd = 20 + Math.random() * 5;
      this.size = 3;
      this.life = 25 + Math.random() * 25;
      this.hitDecay = 10;
      this.knockBack = 7;
    break;
  }
}
bullet.prototype.update = function() {
  this.x+=Math.cos(this.r) * this.spd;
  this.y+=Math.sin(this.r) * this.spd;
  this.life-=1;
  if(PLAYER_LIST[this.id].admin) {
    for(var i in PLAYER_LIST) {
      if(PLAYER_LIST[i].id !== this.id) {
        this.r = Math.atan2(this.y - PLAYER_LIST[i].y, this.x - PLAYER_LIST[i].x) - Math.PI;
      }
    }
  }
}
bullet.prototype.collide = function(t) {
  if(this.x + this.size > t.x && this.x < t.x + 50 && this.y + this.size > t.y && this.y < t.y + 50 && this.id !== t.id) {
    var r = Math.atan2(this.y - t.y, this.x - t.x);
    this.life-=this.hitDecay;
    t.hp-=this.dmg;
    t.aX-=Math.cos(r) * this.knockBack;
    t.aY-=Math.sin(r) * this.knockBack;
    PLAYER_LIST[this.id].exp+=PLAYER_LIST[this.id].expGain;
    PLAYER_LIST[this.id].money+=1;
  }
}
function soldier(x, y, type, id) {
  this.x = x;
  this.y = y;
  this.tX = x;
  this.tY = y;
  this.id = id;
  this.r = 0;
  this.aX = 0;
  this.aY = 0;
  this.type = type;
  switch(this.type) {
    case "Lvl. 1":
      this.maxHp = 100;
      this.spd = 3.5;
      this.range = 600;
      this.wepon = "Sword";
      this.w = 50;
      this.h = 50;
    break;
    case "Lvl. 2":
      this.maxHp = 150;
      this.spd = 3.5;
      this.range = 600;
      this.wepon = "Sword";
      this.w = 50;
      this.h = 50;
    break;
  }
  this.hp = this.maxHp;
  this.closest = this.range;
  this.canShoot = false;
  this.reload = weponTypes[this.wepon].reload;
}
soldier.prototype.update = function() {
  this.sight = this.sight2;
  if(this.x < this.tX) {
    this.x+=this.spd;
  } else if(this.x > this.tX) {
    this.x-=this.spd;
  }
  if(this.y < this.tY) {
    this.y+=this.spd;
  } else if(this.y > this.tY) {
    this.y-=this.spd;
  }
  this.x+=this.aX;
  this.y+=this.aY;
  this.aX*=0.9
  this.aY*=0.9
  if(this.canShoot && this.reload <= 0) {
    bullets.push(new bullet(this.x + 25 + Math.cos(this.r) * weponTypes[this.wepon].length, this.y + 25 + Math.sin(this.r) * weponTypes[this.wepon].length, this.r - weponTypes[this.wepon].spread/2 + Math.random() * weponTypes[this.wepon].spread, weponTypes[this.wepon].bullet, this.id))
    this.reload = weponTypes[this.wepon].reload;
  }
  this.closest = this.range;
  this.canShoot = false;
  this.reload-=1;
}
function addCharacterFromAscii(asciiCode, string) {
  const character = String.fromCharCode(asciiCode); // Convert ASCII code to character

  // Check if the character is the Enter key (carriage return)
  if (character === '\r') {
    string = ""; // Delete the entire string
    return string; // Return the modified string
  }

  // Check if the character is the backspace character
  if (character === '\b') {
    string = string.slice(0, -1); // Delete the last character from the string
    return string; // Return the modified string
  }

  // Check if the character is one of the forbidden characters
  if (character === 's' || character === 'w' || character === 'a' || character === 'd' || character === 'r') {
    console.log("Forbidden character entered. Cannot add to string.");
    return string; // Return the original string without adding the forbidden character
  }

  string += character; // Add the character to the string
  return string;
}
function lineRectCollide(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Check if either endpoint of the line segment is inside the rectangle
  if (pointRectCollide(x1, y1, rx, ry, rw, rh) || pointRectCollide(x2, y2, rx, ry, rw, rh)) {
    return true;
  }

  // Check if any of the line segments of the rectangle intersect the line segment
  const left = lineLineCollide(rx, ry, rx, ry + rh, x1, y1, x2, y2);
  const right = lineLineCollide(rx + rw, ry, rx + rw, ry + rh, x1, y1, x2, y2);
  const top = lineLineCollide(rx, ry, rx + rw, ry, x1, y1, x2, y2);
  const bottom = lineLineCollide(rx, ry + rh, rx + rw, ry + rh, x1, y1, x2, y2);
  
  return left || right || top || bottom;
}

function pointRectCollide(px, py, rx, ry, rw, rh) {
  // Check if point is inside rectangle
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

function lineLineCollide(x1, y1, x2, y2, x3, y3, x4, y4) {
  // Calculate the slopes and y-intercepts of the two lines
  const slope1 = (y2 - y1) / (x2 - x1);
  const slope2 = (y4 - y3) / (x4 - x3);
  const yint1 = y1 - slope1 * x1;
  const yint2 = y3 - slope2 * x3;

  // Check if the lines are parallel
  if (slope1 === slope2) {
    return false;
  }

  // Calculate the intersection point of the two lines
  const xi = (yint2 - yint1) / (slope1 - slope2);
  const yi = slope1 * xi + yint1;

  // Check if the intersection point is on both line segments
  return (xi >= x1 && xi <= x2 || xi >= x2 && xi <= x1) &&
         (yi >= y1 && yi <= y2 || yi >= y2 && yi <= y1) &&
         (xi >= x3 && xi <= x4 || xi >= x4 && xi <= x3) &&
         (yi >= y3 && yi <= y4 || yi >= y4 && yi <= y3);
}

function block(x, y, w, h, type) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.type = type;
  switch(this.type) {
    case "Wall":
      this.hp = 1;
      this.unbreakable = true;
    break;
  }
}

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
//When the page is requested it sends the index.html file
app.use('/client',express.static(__dirname + '/client'));
//^^Routing for files
serv.listen(process.env.PORT);
console.log("Server started");
console.log("Credits to this guy for giving me a multiplayer example: https://replit.com/@kaldisberzins.")
console.log("The example here: https://replit.com/@kaldisberzins/Multiplayer-Game-Example?v=1")
console.log("Everything else is made by me [MathCoolGame].")
console.log("")
console.log("")
console.log("")
console.log("")

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var hp = [1000];
var wave = 0;
var exit = []
var d = 1;
var frameCount = 0;
var mapWidth = 6000;
var mapHeight = 6000;
var chunks = [];
for(var i = 0; i < 100; i+=1) {
  chunks.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ])
}
var blocks = [];
blocks.push(new block(-300, -600, 600, 300, "normal"));
blocks.push(new block(-600, -600, 300, 1200, "normal"));

var projectiles = [
  
]
var soldiers = [
  
];


var bullets = [
  
];
var cam = {
  x: 0,
  y: 0,
}
function dist(x, y, x2, y2) {
  var a = x - x2;
  var b = y - y2;
  return Math.sqrt(a * a + b * b);
}
function lerp(x, y, t) {
  return x - (x - y) * t;
}


//^^These are the lists that keep track of the players and connected clients
var Player = function(id){
	var self = {
		x: mapWidth/2 - 100 + Math.random() * 200,
    y: mapHeight/2 - 100 + Math.random() * 200,
    aX: 0,
    aY: 0,
    server: 0,
    key: -1,
		width: 50,
		height: 50,
    hp: 100, 
    maxHp: 100,
    capBuild: 0,
    admin: false,
    saying: "",
		id: id,
    isUpgrading: false,
		number: "" + Math.floor(10 * Math.random()),
		pressingRight: false,
		pressingLeft: false,
		pressingUp: false,
		pressingDown: false,	
    pressingR: false,
    pressingE: false,
    pressingQ: false,
    pressingM: false,
    energy: 100,
    maxEnergy: 100,
    expGain: 1,
    pressingSpace: false,
    pressingH: false,
    pressingB: false,
    pressingF: false,
    shake: 0,
    aR: 0,
    r: 0,
    cWidth: 0,
    cHeight: 0,
    inventory: ["Sword", "Building Book"],
    unlocked: [true, false],
    team: id,
    mouseX: 0,
    mouseY: 0,
    clicked: false,
    canSlash: 0,
		maxSpd: 4,
    slash: 0,
    finished: false,
    holding: 0,
    host: false,
    canSummon: false,
    exp: 0, 
    lvl: 1,
    money: 0,
    pressed: false,
    reload: 0,
    buildings: 0,
    vR: -4,
    scene: "menu",
    numberPad: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    keyWaitR: 0,
    ar: 0,
	};
	self.updatePosition = function(){
    self.r+=(((Math.atan2(self.cHeight/2 - self.mouseY, self.cWidth/2 - self.mouseX) - Math.PI) - self.r + 180) % 360 - 180);
    switch(self.scene) {
      case "menu":
        if(self.mouseX > self.cWidth/2 - 75 && self.mouseX < self.cWidth/2 + 75 && self.mouseY > self.cHeight/2 + 50 && self.mouseY < self.cHeight/2 + 100 && self.clicked) {
          self.scene = "game"
        }
      break;
      case "game":
        if(self.hp <= 0 || self.energy <= 0) {
          self.x = mapWidth/2 - 100 + Math.random() * 200
      		self.y = mapHeight/2 - 100 + Math.random() * 200
          self.aX = 0
          self.aY = 0
          self.hp = 100;
          self.maxHp = 100      
          self.energy = 100;
          self.maxEnergy = 100;
          self.slash = 0
          self.reload = 100;
          self.money = Math.round(self.money/2);
          self.scene = "menu"
        }
        if(self.admin) {
          self.hp = 1000000000000;
          self.energy = 1000000000000;
          self.maxEnergy = 1000000000000;
          self.maxHp = 1000000000000;
        }
        if(self.pressingH && self.canSummon && self.energy >= 100) {
          soldiers.push(new soldier(self.x, self.y, "Lvl. 1", self.id))
          self.energy-=100;
        }
        self.energy-=0.02;
        if(self.holding == 0 && (self.clicked || self.pressed) && self.reload <= 0) {
          bullets.push(new bullet(self.x + 25 + Math.cos(self.r) * weponTypes[self.inventory[self.holding]].length, self.y + 25 + Math.sin(self.r) * weponTypes[self.inventory[self.holding]].length, self.r - weponTypes[self.inventory[self.holding]].spread/2 + Math.random() * weponTypes[self.inventory[self.holding]].spread, weponTypes[self.inventory[self.holding]].bullet, self.id))
          self.reload = weponTypes[self.inventory[self.holding]].reload;
        }
        if(self.exp > ((self.lvl + 5) * (self.lvl + 5) * 2 + 100)) {
          self.exp = 0;
          self.lvl+=1;
        }
    		if(self.pressingRight) {
    			self.x+=self.maxSpd;
          self.dir = 1;
        }
    		if(self.pressingLeft) {
    			self.x-=self.maxSpd;
          self.dir = 0;
        }
    		if(self.pressingUp) {
          self.y-=self.maxSpd;
        }
        if(self.pressingDown) {
          self.y+=self.maxSpd;
        }
        self.buildings = 0;
  		  if(self.pressingDown) {
  			 self.y+=self.maxSpd;
        }
        if(self.pressingR && (self.keyWaitR <= 0 || self.keyWaitR >= 20)) {
          self.isUpgrading = !self.isUpgrading;
          self.vR*=-1;
        }
        if((self.keyWaitR > 0 && self.vR < 0) || (self.keyWaitR < 20 && self.vR > 0)) {
          self.keyWaitR+=self.vR;
        }
        //Collisions
    		if(self.y + self.height > mapHeight) {
    			self.y = mapHeight - self.height - 1;
          self.aY = 0;
    		}
    		if(self.y < 0) {
    			self.y = 0;
          self.aY = 0;
    		}
        if(self.x + self.width > mapWidth) {
    			self.x = mapHeight - self.width - 1;
          self.aX = 0;
    		}
    		if(self.x < 0) {
    			self.x = 0;
          self.aX = 0;
    		}
        if(self.capBuild > 0 && self.host) {
          self.capBuild-=0.01;
        }
      		//^^If any of the keys are pressed down it moves the player in a direction
      		//
          self.aY*=0.9;
          self.aX*=0.9;
          self.x+=self.aX;
          self.y+=self.aY;
        break;
    }
		//^^If the player is out of bounds set him to the bounds
    for(var i = 0; i < blocks.length; i+=1) {
      switch(blocks[i].type) {
        case "normal":
          if(self.x + self.width > blocks[i].x && self.x < blocks[i].x + blocks[i].w && self.y + self.height > blocks[i].y && self.y < blocks[i].y + blocks[i].h && self.scene == "game") {
            if(self.x > blocks[i].x + 10 - self.width && self.x < blocks[i].x + blocks[i].w - 10) {
              if(self.y < blocks[i].y) {
                self.y = blocks[i].y - self.height;
              } else {
                self.y = blocks[i].y + blocks[i].h;
              }
            } else {
              if(self.x < blocks[i].x + blocks[i].w/2) {
                self.x = blocks[i].x - self.width;
              } else {
                self.x = blocks[i].x + blocks[i].w;
              }
            }
          }
        break;
      }
    }
    for(var i = 0; i < bullets.length; i+=1) {
      bullets[i].update();
      bullets[i].collide(self)
      if(bullets[i].life <= 0) {
        bullets.splice(i, 1)
      }
    }
      
		// update the soldiers
    for(var i = 0; i < soldiers.length; i+=1) {
      if(self.host) {
        soldiers[i].update();
      }
      for(var j = 0; j < soldiers.length; j+=1) {
        if(soldiers[j].x + 50 > soldiers[i].x && soldiers[j].x < soldiers[i].x + 50 && soldiers[j].y + 50 > soldiers[i].y && soldiers[j].y < soldiers[i].y + 50 && self.scene == "game" && i !== j) {
          var r = Math.atan2(soldiers[i].y - soldiers[j].y, soldiers[i].x - soldiers[j].x);
          soldiers[j].aX = -Math.cos(r) * 2;
          soldiers[j].aY = -Math.sin(r) * 2;
          soldiers[i].aX = Math.cos(r) * 2;
          soldiers[i].aY = Math.sin(r) * 2;
        }
      }
      if(soldiers[i].hp < soldiers[i].maxHp) {
        soldiers[i].hp+=0.01;
        if(soldiers[i].hp <= 0) {
          soldiers.splice(i, 1)
        }
      }
    }
    self.x+=self.aX;
    self.y+=self.aY;
    cam.x = self.x;
    cam.y = self.y;
    for(var i = 0; i < self.inventory.length; i+=1) {
      if(self.numberPad[i]) {
        self.holding = i;
      }
    }
    if(self.hp < self.maxHp) {
      self.hp+=self.maxHp/5000;
    }
    if(dist(mapWidth/2, mapHeight/2, self.x, self.y) < 425 && self.energy < self.maxEnergy) {
      self.energy+=1;
    }
    frameCount+=1;
    self.pressingH = false;
    self.pressingF = false;
    self.pressingR = false;
    self.pressingE = false;
    self.pressingB = false;
    self.pressingM = false;
    self.pressingQ = false;
    self.numberPad = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    if(self.clicked) {
      self.pressed = false;
    }
    self.clicked = false;
    self.reload-=1;
    exit = []
	};
	return self;
};
//^^Function for generating players

var io = require('socket.io')(serv, {});

io.sockets.on('connection', function(socket) {
	socket.id = Math.random() * 1000;
	SOCKET_LIST[socket.id] = socket;
	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;
  if(Object.keys(PLAYER_LIST).length === 1){
		for(var i in PLAYER_LIST){
			PLAYER_LIST[i].host = true;
		}
	}
	//On connection adds the player and client to the lists of players and clients
	console.log("Player number " + player.number + " has joined");
  socket.on('disconnect',function() {
    exit.push();
    console.log("Player number " + player.number + " has disconnected");
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
    if(Object.keys(PLAYER_LIST).length === 1){
  		for(var i in PLAYER_LIST){
  			PLAYER_LIST[i].host = true;
  		}
  	} else {
  		var anyBody = false;
  		for(var i in PLAYER_LIST){
  			if(PLAYER_LIST[i].host){
  				anyBody = true;
  			}
  		}
  		if(!anyBody){
  			var picked = false;
  			for(var i in PLAYER_LIST){
  				if(!picked){
  					PLAYER_LIST[i].host = true;
  					picked = true;
  				}
  			}
			}
  	}
	});
	socket.on('keyPress',function(data) {
		if(data.inputId === 'left') {
			player.pressingLeft = data.state;
    } else if(data.inputId === 'right') {
			player.pressingRight = data.state;
    } else if(data.inputId === 'up') {
			player.pressingUp = data.state;
    } else if(data.inputId === 'down') {
			player.pressingDown = data.state;
    } else if(data.inputId === 'space') {
			player.pressingSpace = data.state;
    } else if(data.inputId === 'r') {
			player.pressingR = data.state
    } else if(data.inputId === 'f') {
			player.pressingF = data.state
    } else if(data.inputId === 'h') {
			player.pressingH = data.state
    } else if(data.inputId === 'e') {
			player.pressingE = data.state
    } else if(data.inputId === 'm') {
			player.pressingM = data.state
    } else if(data.inputId === 'b') {
			player.pressingB = data.state
    } else if(data.inputId === 'numbers') {
			player.numberPad[data.state] = true;
    } else if(data.inputId === 'letter' && player.pressingSpace) {
			player.saying = addCharacterFromAscii(data.state, player.saying);
    }
	});
  socket.on('key',function(data) {
    if(data.inputId == "key") {
		  player.key = data.state;
    } else if(data.inputId === 'cWidth')
			player.cWidth = data.state;
		else if(data.inputId === 'cHeight')
			player.cHeight = data.state;
	});
  socket.on('mouse',function(data) {
		if(data.inputId === 'mouseX')
			player.mouseX = data.state;
		else if(data.inputId === 'mouseY')
			player.mouseY = data.state;
    else if(data.inputId === "clicked")
      player.clicked = data.state;
    else if(data.inputId === "pressed")
      player.pressed = data.state
	});
  socket.on('shop',function(data) {
		if(data.inputId === 'minus') {
			player.money-=data.state;
      if(data.bought === "Increased Health") {
        player.maxHp+=30;
        player.hp+=30;
      } else if(data.bought === "Increased Mobility") {
        player.maxSpd+=1;
      } else if(data.bought === "Better Battery") {
        player.maxEnergy+=30;
        player.energy+=30;
      } else if(data.bought === "Imporved Learning") {
        player.expGain*=1.5;
      } else if(data.bought === "Better Weapons") {
        player.inventory[0] = "Long Sword";
      }
    }
	});
	//^^Once the keys that the client is pressing are sent to the server the server saves that information
	
	
});
setInterval(function() {
	var pack = [];
  pack.push({
    blocks: blocks,
    projectiles: projectiles,
    bullets: bullets,
    soldiers: soldiers,
  })
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.updatePosition();
    if(player.scene == "menu") {
      pack.push({
        scene: player.scene,
        money: player.money,
        key: player.key,
  		});
    } else if(player.scene == "game") {
  		pack.push({
  			x: player.x,
  			y: player.y,
        admin: player.admin,
        shake: player.shake,
        height: player.height,
        server: player.server,
        width: player.width,
        mouseX: player.mouseX,
        mouseY: player.mouseY,
  			number: player.number,
        energy: player.energy,
        maxEnergy: player.maxEnergy,
        finished: player.finished,
        maxHp: player.maxHp,
        holding: player.holding,
        hp: player.hp,
        scene: player.scene,
        inventory: player.inventory,
        dir: player.dir,
        r: player.r,
        money: player.money,
        isUpgrading: player.isUpgrading,
        exp: player.exp,
        wave: wave[player.server],
        lvl: player.lvl,
        id: player.id,
        key: player.key,
        keyWaitR: player.keyWaitR,
        cam: cam,
        saying: player.saying,
        unlocked: player.unlocked,
  		});
    }
	}
	//^^Loops through all the players in the list and pushes their data to an array
	for(var n in SOCKET_LIST) {
		var socket = SOCKET_LIST[n];
		socket.emit('newPositions', pack);
	}
	//^^Loops through all the clients in the list and sends them the positions of all the players
},1000/40);
