GAMEWIDTH=360
GAMEHEIGHT=360
LEVELWIDTH=1

window.kb = kaboom({
	global: true,
	width: GAMEWIDTH,
	height: GAMEHEIGHT,
	scale: 2,
	background: [92, 148, 252,],
	fps: 12,
	plugins: []
});

// load assets
loadRoot("./");
loadSprite("tiles", "images/mario.png", {
	sliceX: 16,
	sliceY: 8,
	anims: {
		move: {
			from: 0,
			to: 1,
		},
		idle: {
			from: 2,
			to: 2,
		},
	},
});
loadSprite("player1", "images/mario1.png", {
	sliceX: 8,
	sliceY: 6,
	anims: {
		move1: {
			from: 0,
			to: 3,
		},
		idle1: {
			from: 0,
			to: 0,
		},
		crouch1: {
			from: 0,
			to: 0,
		},
		jump1:{
			from: 5,
			to: 5
		},
		pole1:{
			from: 12,
			to: 12
		},
		move2: {
			from: 16,
			to: 19,
		},
		idle2: {
			from: 16,
			to: 16,
		},
		crouch2: {
			from: 23,
			to: 23,
		},
		jump2:{
			from: 22,
			to: 22
		},
		pole2:{
			from: 28,
			to: 28
		},
		move3: {
			from: 32,
			to: 35,
		},
		idle3: {
			from: 32,
			to: 32,
		},
		jump3:{
			from: 38,
			to: 38
		},
		pole3:{
			from: 44,
			to: 44
		},
		crouch3: {
			from: 39,
			to: 39,
		},
		death: {
			from: 7,
			to: 7
		}
	},
});

loadSprite("troopa", "images/troopa.png", {
	sliceX: 6,
	sliceY: 3,
	anims: {
		move: {
			from: 0,
			to: 1
		},
		fixed: {
			from: 5,
			to: 5
		},
		slide: {
			from: 5,
			to: 5
		},
		fly: {
			from: 2,
			to: 3
		},
		die: {
			from: 1,
			to: 1
		}
	}
})

loadSprite("goomba", "images/goomba.png", {
	sliceX: 3,
	anims: {
		move: {
			from: 0,
			to: 1,
		},
		idle: {
			from: 0,
			to: 0
		},
		die: {
			from: 2,
			to: 2
		},
	},
});

loadSound("jump", "sounds/jump_small.wav");
loadSound("coin", "sounds/smb_coin.wav");
loadSound("powerup0", "sounds/smb_powerup_appears.wav");
loadSound("powerup1", "sounds/smb_powerup.wav");
loadSound("stomp", "sounds/stomp.wav");
loadSound("bump", "sounds/bump.wav");
loadSound("brick", "sounds/brick.wav");
loadSound("pipe", "sounds/smb_pipe.wav");
loadSound("die", "sounds/smb_mariodie.wav");
loadSound("stage", "sounds/stage_clear.wav");
loadSound("1up", "sounds/1up.wav");
loadSound("star", "sounds/star.wav");
loadSound("pole", "sounds/pole.wav");

scene("main", ({ extraLives, initialScore, currentPlayer }) => {

	// define some constants
	var JUMP_FORCE = 460;
	var MOVE_SPEED = 120;
	var FALL_DEATH = 940;

	// define layers, draw "ui" on top, and "game" is the default layer
	layers([
		"bg",
		"game",
		"ui",
	], "game");

	// add level to scene
	var map = levelMap.split('\n')
	LEVELWIDTH = 1
	for(var idx in map){
		LEVELWIDTH = Math.max(LEVELWIDTH, map[idx].length)
	}
	const levelOptions = {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 16,
		height: 16,
		// define each object as a list of components
		"M": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area(),
				solid(),
				origin("bot"),
				"start"
			]
		},
		"=": function () {
			return [
				sprite("tiles", { frame: 82 }),
				area(),
				solid(),
				origin("bot"),
				"tile",
				"block"
			]
		},
		"#": function (opt) {
			return [
				sprite("tiles", { frame: 81 }),
				area(),
				solid(),
				origin("bot"),
				"brick",
				"block"
			]
		},
		"~": function (opt) {
			return [
				sprite("tiles", { frame: 83 }),
				origin("bot"),
				area({width: 8, height: 8, offset:{x:0, y:-4}}),
				body(),
				"explode"
			]
		},
		"X": function () {
			return [
				sprite("tiles", { frame: 112 }),
				area(),
				solid(),
				origin("bot"),
				"floor",
				"block"
			]
		},
		"x": function () {
			return [
				sprite("tiles", { frame: 53 }),
				area(),
				solid(),
				origin("bot"),
				"floor",
				"block"
			]
		},
		"o": function () {
			return [
				sprite("tiles", { frame: 53 }),
				area(),
				solid(),
				origin("bot"),
				"polebase",
				"block"
			]
		},
		"[": function () {
			return [
				sprite("tiles", { frame: 54 }),
				area(),
				solid(),
				origin("bot"),
				"pipebottom",
				"block",
			]
		},
		"]": function () {
			return [
				sprite("tiles", { frame: 55 }),
				area(),
				solid(),
				origin("bot"),
				"pipebottom",
				"block",
			]
		},
		".": function () {
			return [
				sprite("tiles", { frame: 21 }),
				area({ width: 6, height: 6, offset: { x: 0, y: 0 } }),
				solid(),
				origin("bot"),
				"poletop"
			]
		},
		"<": function () {
			return [
				sprite("tiles", { frame: 40 }),
				area({ width: 14, height: 14, offset: { x: 0, y: -2 } }),
				origin("botleft"),
				"flag"
			]
		},
		"|": function () {
			return [
				sprite("tiles", { frame: 37 }),
				area({ width: 4, height: 16, offset: { x: 0, y: 0 } }),
				solid(),
				origin("bot"),
				"polebottom",
				"block",
			]
		},
		"\\": function () {
			return [
				sprite("tiles", { frame: 38 }),
				area(),
				solid(),
				origin("bot"),
				"pipetop"
			]
		},
		"!": function () {
			return [
				sprite("tiles", { frame: 38 }),
				area(),
				solid(),
				origin("bot"),
			]
		},
		"/": function () {
			return [
				sprite("tiles", { frame: 39 }),
				area(),
				solid(),
				origin("bot"),
				"pipetop"
			]
		},
		"i": function () {
			return [
				sprite("tiles", { frame: 39 }),
				area(),
				solid(),
				origin("bot")
			]
		},
		"$": function () {
			return [
				sprite("tiles", { frame: 32 }),
				area(),
				origin("bot"),
				"coin",
			]
		},
		"T": function () {
			return [
				sprite("tiles", { frame: 0 }),
				area(),
				origin("bot"),
				"flower",
				"popup"
			]
		},
		"^": function () {
			return [
				sprite("tiles", { frame: 124 }),
				area(),
				solid(),
				origin("bot"),
				"jumpy",
			]
		},
		"&": function () {
			return [
				sprite("tiles", { frame: 107 }),
				area(),
				solid(),
				origin("bot"),
				"jumpy2",
				area(vec2(0, 10), vec2(16)),
			]
		},
		"%": function () {
			return [
				sprite("tiles", { frame: 48 }),
				area(),
				solid(),
				origin("bot"),
				"grow",
			]
		},
		"*": function () {
			return [
				sprite("tiles", { frame: 48 }),
				area(),
				solid(),
				origin("bot"),
				"coiner",
				{ coins: 1, emptyFrame: 52 }
			]
		},
		"S": function () {
			return [
				sprite("tiles", { frame: 81 }),
				area(),
				solid(),
				origin("bot"),
				"coiner",
				{ coins: 5, emptyFrame: 51 }
			]
		},
		"+": function () {
			return [
				sprite("goomba"),
				area({ width: 12, height: 15, offset: { x: -1, y: -1 } }),
				body(),
				solid(),
				origin("bot"),
				"goomba",
				"flip",
				"block",
				{ moving: false, moveDirection: -1 }
			]
		},
		"n": function () {
			return [
				sprite("troopa"),
				area({ width: 16, height: 22, offset: { x: -1, y: -1 } }),
				body(),
				solid(),
				origin("bot"),
				"troopa",
				"flip",
				"block",
				{ moving: false, moveDirection: -1, mode:"move" }
			]
		},
		"@": function () {
			return [
				sprite("tiles", { frame: 5 }),
				area({width:16,height:16,offset:{x:0, y:-1}}),
				body(),
				origin("bot"),
				"flip",
				"block",
				"mushroom",
				"popup",
				{ moveDirection: 1 }
			]
		},
		"P": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area(),
				solid(),
				origin("bot"),
				"extralive",
			]
		},
		"s": function () {
			return [
				sprite("tiles", { frame: 81 }),
				area(),
				solid(),
				origin("bot"),
				"popstar",
			]
		},
		"t": function () {
			return [
				sprite("tiles", { frame: 16 }),
				area(),
				body(),
				origin("bot"),
				"flip",
				"block",
				"star",
				{ moving: true, moveDirection: 1, animFrames: 10, animFrame: 16 }
			]
		},
		"(": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area({ width: 2, height: 15, offset: { x: 9, y: 0 } }),
				solid(),
				origin("bot"),
				"block",
				"enemyblock",
				{ spawnBlock: "(" }
			]
		},
		")": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area({ width: 2, height: 15, offset: { x: -9, y: 0 } }),
				solid(),
				origin("bot"),
				"block",
				"enemyblock",
				{ spawnBlock: ")" }
			]
		},
		"p": function () {
			return [
				sprite("tiles", { frame: 4 }),
				area(),
				body(),
				origin("bot"),
				"flip",
				"block",
				"popup",
				"live",
				{ moveDirection: 1 }
			]
		},
		"0": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area({ width: 16, height: 16, offset: { x: 0, y: 0 } }),
				origin("bot"),
				"transport",
				{ current: 0 }
			]
		},
		"1": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area({ width: 16, height: 16, offset: { x: 0, y: 0 } }),
				origin("bot"),
				"transport",
				{ current: 1 }
			]
		},
		"2": function () {
			return [
				sprite("tiles", { frame: 6 }),
				area({ width: 16, height: 16, offset: { x: 0, y: 0 } }),
				origin("bot"),
				"transport",
				{ current: 2 }
			]
		},
	}
	window.level = addLevel(map, levelOptions);
	onUpdate(function(){
		if (player.transporting) {
			drawRect({width:GAMEWIDTH,height:GAMEHEIGHT,pos:vec2(0,0),color:kb.BLACK})
		}
	})

	// add score counter obj
	const score = add([
		text("" + initialScore, { size: 16, font: "sinko" }),
		pos(20, 30),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: initialScore,
		},
	]);

	add([
		sprite("player1"),
		pos(280, 30),
		scale(1.25),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: extraLives,
		},
	]);
	const lives = add([
		text("x" + extraLives, { size: 16, font: "sinko" }),
		pos(315, 30),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: extraLives,
		},
	]);
	// define player object
	var player1 = add([
		sprite("player1"),
		origin("bot"),
		layer("game"),
		pos(16, 10),
		scale(1),
		area({ width: 12, height: 16, offset: { x: 0, y: -2 } }),
		body(),
		"player",
		{ size: 1, jumpPower: JUMP_FORCE, movable: true }
	]);
	player1.paused=true
	setTimeout(function () {
		player1.paused=false
	},2000)
	console.log('current',currentPlayer)
	if(currentPlayer){
		player1.size=currentPlayer.size
	}
	window.player = player1;	
	function playerArea(player){
		if (player.size==1){
			player.area.width=11
			player.area.height=16
			player.area.offset.x=0
			player.area.offset.y=-2
		}
		else if (player.crouch){
			player.area.width=15
			player.area.height=18
			player.area.offset.x=0
			player.area.offset.y=-1
		}
		else {
			player.area.width=12
			player.area.height=30
			player.area.offset.x=0
			player.area.offset.y=-2
		}
	}

	function showPlayer(size) {
		player.size = size
		playerArea(player)
	}

	onCollide("player", "star", (p, s) => {
		p.star = 400
		if (!p.starMusic) {
			p.starMusic = play("star", {loop: true})
		} else {
			p.starMusic.play()
		}
		destroy(s);
	});

	// grow an mushroom if player's head bumps into an obj with "prize" tag
	var onHeadbutt = (obj) => {
		if (obj.is("grow") && obj.frame == 48) {
			play("powerup0")
			obj.frame = 52;
			if (player.size == 1) {
				var g = level.spawn("@", obj.gridPos.sub(0, 0));
				g.solid = false
				g.weight=0
				g.z=-1
				g.moveDirection = 0
				g.timer = 32
			} else {
				var f = level.spawn("T", obj.gridPos.sub(0, 0));
				f.solid = false
				f.weight=0
				f.z=-1
				f.moveDirection = 0
				f.timer = 16
			}
		}
		if (obj.is("extralive") && obj.frame == 6) {
			play("powerup0")
			obj.frame = 52;
			level.spawn("p", obj.gridPos.sub(0, 1));
		}
		if (obj.is("popstar") && obj.frame == 81) {
			play("powerup0")
			obj.frame = 52;
			level.spawn("t", obj.gridPos.sub(0, 1));
		}
		if (obj.is("brick")) {
			if (player.size == 1) {
				obj.pos.y -= 6;
				play("stomp")
				setTimeout(function () {
					obj.pos.y += 6;
				}, 120)
			} else {
				obj.pos.y -= 10;
				obj.solid = false;
				destroy(obj);
				play("brick")
				var o1 = null
				o1 = level.spawn("~", obj.gridPos.sub(0, 0));
				o1.moveX = 1
				o1.moveY = -3
				o1.moveBy(8,8)
				o1.timer = 12
				o1.solid = false
				o1 = level.spawn("~", obj.gridPos.sub(0, 0));
				o1.moveX = 1
				o1.moveY = -4
				o1.moveBy(12,12)
				o1.timer = 12
				o1.solid = false
				o1 = level.spawn("~", obj.gridPos.sub(0, 0));
				o1.moveX = -1
				o1.moveY = -3
				o1.timer = 12
				o1.moveBy(-8,8)
				o1.solid = false
				o1 = level.spawn("~", obj.gridPos.sub(0, 0));
				o1.moveX = -1
				o1.moveY = -4
				o1.timer = 12
				o1.moveBy(-12,12)
				o1.solid = false
				setTimeout(function () { destroy(obj) }, 200)
			}
		}
		if (obj.is("coiner") && obj.frame != obj.emptyFrame) {
			play("coin")
			obj.coins--;
			score.value++;
			score.text = score.value;
			var coin1 = level.spawn("$", obj.gridPos.sub(0, 1));
			var posy = coin1.pos.y
			coin1.action(() => {
				coin1.move(0, -100)
				if (posy - coin1.pos.y > 20) {
					destroy(coin1)
				}
			})
			if (obj.coins == 0) {
				obj.frame = obj.emptyFrame;
				return
			}	
		}
		if (obj.frame == 52) {
			play("bump")
		}
	}
	player1.on("headbutt", onHeadbutt);

	action("start", function (s) {
		console.log('start', s.pos.x, s.pos.y)
		player.pos.x = s.pos.x
		player.pos.y = s.pos.y
		setTimeout(function () {
			player1.paused=false
		},200)
		destroy(s)
	})
	window.paused=[]
	window.removed={}
	window.restoreInterval=setInterval(function (b){
		for (var idx = paused.length -1; idx>=0; idx--){
			var pos = paused[idx].screenPos()
			if (pos.x>GAMEWIDTH*2 || pos.x<-GAMEWIDTH){
			} else {
				paused[idx].paused = false
				paused.splice(idx, 1)
			}	
		}
		var restored=0
		var total=0
		for (var idx in removed){
			total++
			var pos = removed[idx].screenPos()
			if (pos.x>GAMEWIDTH*1.5 || pos.x<-GAMEWIDTH*0.5){
			} else {
				removed[idx]._id=idx;
				removed[idx].paused=false;
				removed[idx].solid=true;
				delete removed[idx]
				restored++
			}	
		}
		// console.log('restored',restored,total)
	},500)
	window.transports = {}
	every("transport", function(t){
		if (!transports[t.current]) transports[t.current]=[]
		t.pushed=true
		t.index=transports[t.current].length
		transports[t.current].push(t)	
	})
	action("block", function (b) {
		var pos = b.screenPos()
		if (pos.x>GAMEWIDTH*1.5 || pos.x<-GAMEWIDTH*0.5){
			b.paused = true
			b.solid = false
			removed[b._id]=b
			b._id=null
		}
		else{
			b.paused = false
		}
	//b.solid = player.pos.dist(b.pos) < 360; // arbitrary distance based on you tile size
	})
	action("explode", function (s) {
		if (timer==12){
			console.log('jump')
			s.jump(JUMP_FORCE*2)
			s.solid = false
		} else {
			s.moveBy(s.moveX,s.moveY)
		}
		if (timer){
			s.timer--
		}
		if (s.timer==0){
			destroy(s)
		}
	})
	action("coiner", function(c){
		if (c.frame==48 && !c.timer) {
			c.frame=49
			c.timer=10
		}
		else if (c.frame==49 && !c.timer) {
			c.frame=50
			c.timer=10
		}
		else if (c.frame==50 && !c.timer) {
			c.frame=48
			c.timer=10
		}
		if (c.timer){
			c.timer--
		}
	})
	action("popup", function (p) {
		if (p.timer){
			console.log('popup')
			p.flipping = true
			p.moveBy(0,-1)
			p.timer--
			if (p.timer==0){
				p.flipping = false
				p.solid=true
				p.weight=1
				p.moveDirection=1
			} else {
				return
			}
		}
	})
	action("mushroom", function (p) {
		p.move(p.moveDirection * 50, 0)
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})
	action("live", function (p) {
		p.move(p.moveDirection * 50, 0)
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})
	action("fly", function (p) {
		p.moveBy(0, -p.vel)
		p.seq++
		if (p.seq > 60) {
			destroy(p)
		}
	})
	player.action(function (p) {
		// center camera to player
		if (!p.transporting){
			if (p.pos.x>172 || LEVELWIDTH<24){
				camPos(p.pos);
			} else {
				camPos({x:172,y:p.pos.y})
			}
		}
		// check fall death
		if (p.pos.y >= FALL_DEATH) {
			go("lose", { score: score.value, lives: lives.value });
		}
		if (p.star) {
			p.star--
			var op = 1
			if (p.star<100){
				op = p.star % 10
			} else {
				op = p.star % 5
			}
			p.opacity = 1 - (op / 10)	
		} else {
			p.opacity = 1
			if (p.starMusic){
				p.starMusic.pause()
			}
		}
		if (!p.curAnim() && p.grounded() && !p.crouch && p.movable) {
			p.play("idle"+p.size)
		}
	})
	basepole = 0
	every("polebottom", function (p) {
		basepole = Math.max(basepole, p.pos.y)
	})
	action("flag", function (p) {
		if (player.flagPos && !p.flagDown) {
			p.pos.y = player.pos.y
			if (p.pos.y>=basepole){
				p.flagDown = true
				setTimeout(function () {
					if (p.starMusic){
						player.starMusic.pause()
					}
					go("winlevel", { score: score.value, lives: lives.value });
				},1000)
			}
		}
	})
	action("star", function (p) {
		p.weight=0.5
		if (p.grounded()) {
			p.jump(JUMP_FORCE * 0.5);
		}
		p.animFrame += (1 / p.animFrames);
		p.frame = Math.floor(p.animFrame);
		console.log(p.frame)
		if (p.frame >= 20) {
			p.animFrame = 16;
			p.frame = 16;
		}
		p.moveBy(p.moveDirection, 0)
	})
	action("goomba", function (g) {
		var pos = g.screenPos()
		if (pos.x<=GAMEWIDTH) {
			goomba=g
			g.moveBy(g.moveDirection, 0)
			if (g.curAnim()!='move'){
				g.play("move")
				g.moving = true
				g.flipping = false
			}
		}
		if (g.pos.y >= FALL_DEATH) {
			destroy(g)
		}
	})
	action("troopa", function (g) {
		var pos = g.screenPos()
		var vel = {
			'slide' : 2.5,
			'move' : 1.0,
			'fixed' : 0
		}
		if (pos.x<=GAMEWIDTH) {
			var factor = vel[g.mode]
			g.moveBy(g.moveDirection*factor, 0)
			if (g.curAnim()!=g.mode){
				g.play(g.mode)
				g.moving = true
				g.flipping = false
			}
		}
		if (g.timer){
			g.timer--
		}
		if (g.pos.y >= FALL_DEATH) {
			destroy(g)
		}
	})

	onCollide("flip", "block", (go, bl, col) => {
		if (col && (col.isLeft()||col.isRight()) && !go.flipping) {
			clearTimeout(go.flipProc)
			go.flipping = true
			go.flipProc = setTimeout(function(){
				go.moveDirection *= -1
				go.moveBy(go.moveDirection * 2, 0)
				go.flipX(go.moveDirection > 0)
				go.flipping = false
			},100)
		}
	})
	onCollide("player", "transport", function (p,t){
		if (!transports[t.current+1]) return
		if (t.active) return
		window.nextPoint = transports[t.current+1][0]
	})
	onCollide("player", "polebottom", (p, m) => {
		p.flagPos = true
		player.movable = false
		player.paused=true
		player.falling=setInterval(function(){
			player.pos.y+=1
			if (player.pos.y>=basepole){
				player.paused=false
				clearInterval(player.falling)
			}
		},60)
		play("pole")
		player.play("pole" + player.size)
	});
	onCollide("player", "polebase", (p, m, col) => {
		if (col) {
			console.log('finish',col.isTop(),col.isBottom())
		}
	});
	onCollide("player", "mushroom", (p, m) => {
		destroy(m);
		play("powerup1")
		showPlayer(2)
	});
	onCollide("player", "pipetop", (p1, p2, col) => {
		var diffx = p1.pos.x - p2.pos.x
		if (col && col.isBottom() && player.crouch) {
			//fix player position right`
			if (diffx < 0 && p2.frame == 38) {
				p1.pos.x = p2.pos.x + 3
			}
			//fix player position left
			if (diffx > 1 && p2.frame == 39) {
				p1.pos.x = p2.pos.x - 3
			}
			console.log('enter', diffx, p2)
			player.paused=true
			player.solid=false
			player.z = -1
			var proc = 0
			p1.movable = false
			p1.lastY = p1.pos.y
			proc = setInterval(function () {
				p1.pos.y += 2
				if ((p1.pos.y-p1.lastY) > 34) {
					if (!p1.movable) {
						p1.movable = true
						p1.area.offset.y = 0;
						clearInterval(proc)
						// transport
						nextPoint.active=true
						p1.z=0
						p1.solid=true

						p1.transporting=true
						setTimeout(function(){
							p1.transporting=false
							nextPoint.active=false
						},500)
						setTimeout(function(){
							p1.paused=false
						},1000)
						p1.pos.x=nextPoint.pos.x
						p1.pos.y=nextPoint.pos.y
						camPos(p1.pos);
						//
						// go("main", { extraLives: lives.value, initialScore: score.value, currentPlayer: player })
					}
				}
			}, 100)

		}
	});
	onCollide("player", "flower", (p, m) => {
		destroy(m);
		play("powerup1")
		console.log('flower', p.size)
		if (p.size>=2){
			showPlayer(3)
		} else {
			showPlayer(2)
		}
	});
	onCollide("player", "live", (p, m) => {
		if (m.hidden) return;
		m.hidden = true
		destroy(m);
		play("1up")
		lives.value++
		lives.text = "x" + lives.value
		setTimeout(function () {
			var up = add([
				text("1UP", { size: 8, font: "sinko" }),
				pos(p.pos.x, p.pos.y),
				origin("botleft"),
				"fly",
				layer("ui"),
				{ seq: 0, vel: 1 }
			])
		})
	});

	onCollide("player", "goomba", (p, g) => {
		var diffy = p.pos.y - g.pos.y
		g.solid = false
		g.z = 2
		if (diffy < 0) {
			g.timer = 12
			g.solid = false
			g.moveBy(0,5)
			play("stomp")
			setTimeout(function () {
				p.jump(JUMP_FORCE/2)
				g.play("die")
			}, 20)
			setTimeout(function () {
				destroy(g)
			}, 100)
			return
		}
		if (!g.timer && p.star) {
			g.timer = 12
			play("stomp")
			return
		}
		if (g.removed){
			return
		}
		if (!g.timer) {
			g.removed=true
			if (!p.star) {
				if (p.size >= 2) {
					play("pipe")
					showPlayer(1)
				} else {
					destroy(g);
					play("die")
					player.play("death")
					player.moveBy(g.moveDirection * 10, 0)
					player.jump(JUMP_FORCE / 3)
					player.solid = false
					setTimeout(function () {
						go("lose", { score: score.value, lives: lives.value });
					}, 500)
				}
			}
		}
	});

	onCollide("player", "troopa", (p, g) => {
		var diffy = p.pos.y - g.pos.y
		if (diffy < 0 && !g.timer && p.falling()) {
			play("stomp")
			if (g.curAnim()=="slide" ) {
				g.timer = 12
				g.solid = false
				g.moveBy(0,5)
				setTimeout(function () {
					p.jump(JUMP_FORCE/2)
					g.play("die")
				}, 20)
				setTimeout(function () {
					destroy(g)
				}, 100)	
			} else if (g.curAnim()=="move"){
				setTimeout(function () {
					p.jump(JUMP_FORCE/2)
				}, 20)
				g.timer = 12
				g.mode="fixed"
			} 
			return
		}
		if (!g.timer && p.star) {
			g.timer = 12
			play("stomp")
			return
		}
		if (g.removed){
			return
		}
		if (g.curAnim()=="fixed"){
			setTimeout(function () {
				p.jump(JUMP_FORCE/2)
			}, 20)
			g.timer = 12
			g.mode="slide"
		}
		else if (!g.timer) {
			console.log('t',diffy, g.timer,g.curAnim(),p.falling(),g.removed)
			g.removed=true
			if (!p.star) {
				if (p.size >= 2) {
					play("pipe")
					showPlayer(1)
					g.removed=false
					g.timer = 20
				} else {
					destroy(g);
					play("die")
					player.play("death")
					player.moveBy(g.moveDirection * 10, 0)
					player.jump(JUMP_FORCE / 3)
					player.solid = false
					setTimeout(function () {
						go("lose", { score: score.value, lives: lives.value });
					}, 500)
				}
			}
		}
	});	

	onCollide("player", "jumpy", (p, j) => {
		console.log('jumpy')
		setTimeout(function () {
			p.jump(JUMP_FORCE * 1.5)
		}, 10)
		p.play("jump"+p.size);
		j.frame = 123;
		var jmp2 = level.spawn("&", j.gridPos.sub(0, 1));
		jmp2.ref = j
		jmp2.time = time()
		setTimeout(function () {
			j.frame = 124;
			destroy(jmp2)
		}, 500)
	});
	onCollide("player", "jumpy2", (p, j) => {
		console.log('jumpy2')
		var diff = time() - j.time
		if (diff > 0) {
			j.ref.frame = 124;
			destroy(j)
		}
	});
	onCollide("player", "enemyblock", (pl, en, coll) => {
		destroy(en)
		if (!en.blocked) {
			en.blocked = true
			setTimeout(function () {
				var xtNew = level.spawn(en.spawnBlock, en.gridPos.sub(0, 0))
			}, 200)
		}
	})
	onCollide("player", "extralive", (pl, xt, coll) => {
		var diffy = pl.pos.y - xt.pos.y;
		console.log('colision', diffy, xt.frame)
		if (diffy < 15 && xt.frame != 52 && !xt.collided) {
			xt.collided = true
			destroy(xt)
			setTimeout(function () {
				var xtNew = level.spawn("P", xt.gridPos.sub(0, 0))
				xtNew.frame = xt.frame
				xtNew.collided = false
			}, 200)
		}
	})

	// increase score if meets coin
	onCollide("player", "coin", (p, c) => {
		destroy(c);
		play("coin");
		score.value++;
		score.text = score.value;
	});

	// jump with space
	keyPress("up", () => {
		// these 2 functions are provided by body() component
		if (!player.movable) {
			return
		}
		player.play("jump"+player.size);
		if (player.grounded()) {
			player.jump(player.jumpPower);
		}
	});

	onKeyDown("down", () => {
		if (!player.movable) {
			return
		}
		if (player.grounded()) {
			player.play("crouch"+player.size);
			if (!player.crouch){
				player.moveBy(0, -2);
				player.crouch = true;	
			}
			playerArea(player);
			clearTimeout(player.downProc)
			player.downProc=setTimeout(function () {
				console.log('uncrouch')
				player.crouch = false;
				playerArea(player);
			}, 200)
		}
	});

	keyDown("left", () => {
		if (!player.movable) {
			return
		}
		if (player.grounded() && player.curAnim() != "move"+player.size) {
			player.play("move"+player.size);
		}
		player.flipX(true)
		player.flipped = true
		player.move(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		if (!player.movable) {
			return
		}
		if (player.grounded() && player.curAnim() != "move"+player.size) {
			player.play("move"+player.size);
		}
		player.flipX(false)
		player.flipped = false
		player.move(MOVE_SPEED, 0);
	});

});

scene("lose", ({ score, lives }) => {
	clearInterval(window.restoreInterval)
	lives--
	if (lives >= 0) {
		add([
			sprite("player1"),
			pos(width() / 2 - 40, height() / 4),
			scale(1.25),
			fixed(),
			origin("botleft"),
			layer("ui")
		]);
		add([
			text('x' + lives, { size: 16, font: "sinko" }),
			origin("bot"),
			pos(width() / 2 + 10, height() / 4),
		]);
	}
	add([
		text('Score: ' + score, { size: 24, font: "sinko" }),
		origin("bot"),
		pos(width() / 2, height() / 2),
	]);
	if (lives == -1) {
		add([
			text('Game Over', { size: 24, font: "sinko" }),
			origin("bot"),
			pos(width() / 2, height() * 3 / 4),
		]);
		lives = 2
		score = 0
	}
	keyDown("space", () => {
		go("main", { extraLives: lives, initialScore: score });
	});
});

scene("winlevel", ({ score, lives }) => {
	clearInterval(window.restoreInterval)
	play("stage")
	add([
		sprite("player1"),
		pos(width() / 2 - 40, height() / 4),
		scale(1.25),
		fixed(),
		origin("botleft"),
		layer("ui")
	]);
	add([
		text('x' + lives, { size: 16, font: "sinko" }),
		origin("bot"),
		pos(width() / 2 + 10, height() / 4),
	]);
	add([
		text('Score: ' + score, { size: 24, font: "sinko" }),
		origin("bot"),
		pos(width() / 2, height() / 2),
	]);
	add([
		text('Level Completed!', { size: 24, font: "sinko" }),
		origin("bot"),
		pos(width() / 2, height() * 3 / 4),
	]);
	keyDown("space", () => {
		go("main", { extraLives: lives, initialScore: score });
	});
});

function loadHash() {
	levelMap = decodeURIComponent(document.location.hash.substring(1).replace(/N/g, '\n').replace(/_/, ' '))
	go("main", { extraLives: 2, initialScore: 0 })
	document.querySelector("canvas").focus()
}
window.onhashchange = loadHash;

if (document.location.hash.length > 2) {
	loadHash()
} else if (currentLevel == 'currentmap') {
	levelMap = localStorage.getItem('currentmap')
	go("main", { extraLives: 2, initialScore: 0 })
	document.querySelector("canvas").focus()
} else {
	fetch("levels/" + currentLevel + ".txt?" + Math.random())
		.then((response) => response.text())
		.then((text) => {
			levelMap = text
			go("main", { extraLives: 2, initialScore: 0 })
			document.querySelector("canvas").focus()
		})
}
