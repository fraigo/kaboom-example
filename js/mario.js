window.kb = kaboom({
	global: true,
    width: 360,
    height: 360,
    scale: 2,
	background: [92, 148, 252, ],
	fps: 12,
    plugins: [ peditPlugin, asepritePlugin, kbmspritePlugin ]
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
loadSprite("player1a", "images/mario_s1.png", {
	sliceX: 6,
	anims: {
		move: {
			from: 0,
			to: 3,
		},
		idle: {
			from: 0,
			to: 0,
		},
	},
});
loadSprite("player1b", "images/mario_s2.png", {
	sliceX: 7,
	anims: {
		move: {
			from: 0,
			to: 3,
		},
		idle: {
			from: 0,
			to: 0,
		},
	},
});
loadSprite("player1c", "images/mario_s3.png", {
	sliceX: 8,
	anims: {
		move: {
			from: 0,
			to: 3,
		},
		idle: {
			from: 0,
			to: 0,
		},
	},
});
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

scene("main", ({extraLives, initialScore}) => {

	// define some constants
	const JUMP_FORCE = 460;
	const MOVE_SPEED = 120;
	const FALL_DEATH = 640;

	// define layers, draw "ui" on top, and "game" is the default layer
	layers([
		"bg",
		"game",
		"ui",
	], "game");

	// add level to scene
	var map = levelMap.split('\n')
	const level = addLevel(map, {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 17,
		height: 17,
		// define each object as a list of components
		"=": function() { return [
			sprite("tiles",{frame: 82}),
			area(),
			solid(),
			origin("bot"),
			"tile",
			"block"
		]},
		"#": function() { return [
			sprite("tiles",{frame: 81}),
			area(),
			solid(),
			origin("bot"),
			"brick",
			"block"
		]},
		"X": function() { return [
			sprite("tiles",{frame: 112}),
			area(),
			solid(),
			origin("bot"),
			"floor",
			"block"
		]},
		"[": function() { return [
			sprite("tiles",{frame: 54}),
			area(),
			solid(),
			origin("bot"),
			"pipebottom",
			"block",
		]},
		"]": function() { return [
			sprite("tiles",{frame: 55}),
			area(),
			solid(),
			origin("bot"),
			"pipebottom",
			"block",
		]},
		".": function() { return [
			sprite("tiles",{frame: 21}),
			area({width: 4, height: 6, offset: {x:0, y:0}}),
			solid(),
			origin("bot"),
			"poletop"
		]},
		"<": function() { return [
			sprite("tiles",{frame: 40}),
			area({width: 14, height: 14, offset: {x:0, y:-2}}),
			origin("botleft"),
			"flag"
		]},
		"|": function() { return [
			sprite("tiles",{frame: 37}),
			area({width: 4, height: 16, offset: {x:0, y:0}}),
			solid(),
			origin("bot"),
			"polebottom",
			"block",
		]},
		"\\": function() { return [
			sprite("tiles",{frame: 38}),
			area(),
			solid(),
			origin("bot"),
			"pipetop"
		]},
		"/": function() { return [
			sprite("tiles",{frame: 39}),
			area(),
			solid(),
			origin("bot"),
			"pipetop"
		]},
		"$": function() { return [
			sprite("tiles",{frame: 32}),
			area(),
			origin("bot"),
			"coin",
		]},
		"T": function() { return [
			sprite("tiles",{frame: 0}),
			area(),
			origin("bot"),
			"flower",
		]},
		"^": function() { return [
			sprite("tiles",{frame:124}),
			area(),
			solid(),
			origin("bot"),
			"jumpy",
		]},
		"&": function() { return [
			sprite("tiles",{frame:107}),
			area(),
			solid(),
			origin("bot"),
			"jumpy2",
			area(vec2(0, 10), vec2(16)),
		]},
		"%": function() { return [
			sprite("tiles",{frame:48}),
			area(),
			solid(),
			origin("bot"),
			"grow",
		]},
		"*": function() { return [
			sprite("tiles",{frame:48}),
			area(),
			solid(),
			origin("bot"),
			"coiner",
			{coins: 1, emptyFrame:52}
		]},
		"5": function() { return [
			sprite("tiles",{frame:48}),
			area(),
			solid(),
			origin("bot"),
			"coiner",
			{coins: 5, emptyFrame:49}
		]},
		"+": function() { return [
			sprite("goomba"),
			area({width: 12, height: 16, offset: {x:-1, y:0}}),
			body(),
			origin("bot"),
			"goomba",
			"flip",
			"block",
			{moving: false, moveDirection:-1}
		]},
		"@": function() { return [
			sprite("tiles",{frame:5}),
			area(),
			body(),
			origin("bot"),
			"flip",
			"block",
			"mushroom",
			{moveDirection:1}
		]},
		"P": function() { return [
			sprite("tiles",{frame:6}),
			area(),
			solid(),
			origin("bot"),
			"extralive",
		]},
		"(": function() { return [
			sprite("tiles",{frame:6}),
			area({width: 2, height: 15, offset: {x:9, y:0}}),
			solid(),
			origin("bot"),
			"block",
			"enemyblock",
			{spawnBlock:"("}
		]},
		")": function() { return [
			sprite("tiles",{frame:6}),
			area({width: 2, height: 15, offset: {x:-9, y:0}}),
			solid(),
			origin("bot"),
			"block",
			"enemyblock",
			{spawnBlock:")"}
		]},
		"p": function() { return [
			sprite("tiles",{frame:4}),
			area(),
			body(),
			origin("bot"),
			"flip",
			"block",
			"live",
			{moveDirection:1}
		]},
	});

	// add score counter obj
	const score = add([
		text(""+initialScore,{size:16,font:"sinko"}),
		pos(20,30),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: initialScore,
		},
	]);

	add([
		sprite("player1a"),
		pos(300,30),
		scale(1.25),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: extraLives,
		},
	]);
	const lives = add([
		text("x"+extraLives,{size:16,font:"sinko"}),
		pos(315,30),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: extraLives,
		},
	]);
	// define player object
	var player1a = add([
		sprite("player1a"),
		origin("bot"),
		layer("game"),
		pos(16, 10),
		scale(1),
		area({width: 10, height: 16, offset: {x:-1, y:0}}),
		body(),
		"player",
		{size:1, jumpPower: JUMP_FORCE, movable: true}
	]);
	var player1b = add([
		sprite("player1b"),
		origin("bot"),
		layer("game"),
		pos(16, 10),
		scale(1),
		area({width: 12, height: 30, offset: {x:-1, y:0}}),
		body(),
		"player",
		{size:2, jumpPower: JUMP_FORCE * 1.2, movable: true}
	]);
	var player1c = add([
		sprite("player1c"),
		origin("bot"),
		layer("game"),
		pos(16, 10),
		scale(1),
		area({width: 12, height: 30, offset: {x:-1, y:0}}),
		body(),
		"player",
		{size:2, jumpPower: JUMP_FORCE * 1.2, movable: true}
	]);
	player1b.hidden = true;
	player1b.solid = false;
	player1c.hidden = true;
	player1c.solid = false;
	window.player = player1a;

	function showPlayer(p){
		player.hidden = true
		player.solid = false
		p.pos.x = player.pos.x
		p.pos.y = player.pos.y
		p.hidden = false
		p.solid = true
		player = p
	}

	// action() runs every frame
	player.action(() => {
		// center camera to player
		camPos(player.pos);
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose", { score: score.value, lives: lives.value});
		}
	});

	// if player collides with any obj with "dangerous" tag, lose
	player.collides("dangerous", () => {
		go("lose", { score: score.value, lives: lives.value });
	});

	// grow an mushroom if player's head bumps into an obj with "prize" tag
	var onHeadbutt = (obj) => {
		if (obj.is("grow") && obj.frame==48) {
			play("powerup0")
			obj.frame=52;
			if (player.size == 1){
				level.spawn("@", obj.gridPos.sub(0, 1));
			} else {
				level.spawn("T", obj.gridPos.sub(0, 1));
			}
		}
		if (obj.is("extralive") && obj.frame==6) {
			play("powerup0")
			obj.frame=52;
			level.spawn("p", obj.gridPos.sub(0, 1));
		}
		if (obj.is("brick")) {
			if (player.size==1){
				obj.pos.y-=6;
				play("stomp")
				setTimeout(function(){
					obj.pos.y+=6;
				},120)	
			} else {
				obj.frame = 83
				obj.pos.y-=10;
				play("brick")
				setTimeout(function(){destroy(obj)},200)
			}
		}
		if (obj.is("coiner") && obj.frame==48) {
			play("coin")
			obj.coins--;
			score.value++;
			score.text = score.value;
			var coin1 = level.spawn("$", obj.gridPos.sub(0, 1));
			var posy = coin1.pos.y
			coin1.action(() => {
				coin1.move(0,-100)
				if (posy - coin1.pos.y > 20){
					destroy(coin1)
				}
			})
			if (obj.coins == 0){
				obj.frame=obj.emptyFrame;
				return
			}
		}
		if (obj.frame==49) {
			play("bump")
		}
	}
	player1a.on("headbutt", onHeadbutt);
	player1b.on("headbutt", onHeadbutt);

	action("mushroom", function(p){
		p.move(p.moveDirection*50,0)
		p.flipping = false
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})
	action("live", function(p){
		p.move(p.moveDirection*50,0)
		p.flipping = false
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})
	action("fly", function(p){
		p.moveBy(0,-p.vel)
		p.seq++
		if (p.seq>60){
			destroy(p)
		}
	})
	action("player", function(p){
		if (!p.curAnim() && p.grounded()){
			p.frame=0
		}
	})
	basepole = 0
	every("polebottom",function(p){
		basepole = Math.max(basepole,p.pos.y)
		console.log('minpole', basepole)
	})
	action("flag",function(p){
		if (player.flagPos && !p.flagDown){
			p.pos.y = player.pos.y
			console.log('flag',p.pos.y)
			if (p.pos.y==basepole){
				p.flagDown = true
				go("winlevel", { score: score.value, lives: lives.value });
			}
		}
	})
	action("goomba", function(g){
		var diffx=Math.abs(player.pos.x-g.pos.x);
		if (diffx<200 || g.moving){
			g.moveBy(g.moveDirection,0)
			g.moving = true
			g.flipping = false
		}
		if (g.frame<2){
			var t = Math.round(time()*10)
			g.frame=(t)%2;	
		} else {
			g.timer--;
			if (g.timer==0){
				destroy(g)
			}
		}
		if (g.pos.y >= FALL_DEATH) {
			destroy(g)
		}
	})

	onCollide("flip", "block", (go, bl) => {
		if (bl.pos.y<=go.pos.y && !go.flipping){
			go.moveDirection *= -1
			go.moveBy(go.moveDirection*2,0)
			go.flipX(go.moveDirection>0)
			go.flipping = true
		}
	})
	onCollide("player", "polebottom", (p, m) => {
		p.flagPos = true
		player.movable = false
	});
	onCollide("player", "mushroom", (p, m) => {
		destroy(m);
		play("powerup1")
		showPlayer(player1b)
	});
	onCollide("player", "flower", (p, m) => {
		destroy(m);
		play("powerup1")
		showPlayer(player1c)
	});
	onCollide("player", "live", (p, m) => {
		if (m.hidden) return;
		m.hidden = true
		destroy(m);
		play("powerup1")
		lives.value++ 
		lives.text = "x" + lives.value
		setTimeout(function(){
			var up = add([
				text("1UP",{size:8,font:"sinko"}),
				pos(p.pos.x,p.pos.y),
				origin("botleft"),
				"fly",
				layer("ui"),
				{seq:0, vel:1}
			])	
		})
	});

	onCollide("player", "goomba", (p, g) => {
		var diffy = p.pos.y-g.pos.y
		console.log('pg',diffy,g.timer)
		if(g.frame<2 && diffy<0){
			play("stomp")
			setTimeout(function(){
				p.jump(300)
			},20)
			g.frame=2
			g.timer=10
		} else if (!g.timer){
			destroy(g);
			if (p.size==2){
				play("pipe")
				showPlayer(player1a)
			} else {
				go("lose", { score: score.value, lives: lives.value });
			}
		}
	});

	onCollide("player", "jumpy", (p, j) => {
		console.log('jumpy')
		setTimeout(function(){
			p.jump(JUMP_FORCE*2)
		},10)
		p.frame=1;
		j.frame=123;
		var jmp2 = level.spawn("&", j.gridPos.sub(0, 1));
		jmp2.ref = j
		jmp2.time = time()
		setTimeout(function(){
			j.frame=124;
			destroy(jmp2)
		},500)
	});
	onCollide("player", "jumpy2", (p, j) => {
		console.log('jumpy2')
		var diff = time()-j.time
		if (diff>0){
			j.ref.frame=124;
			destroy(j)	
		}
	});
	onCollide("player", "enemyblock", (pl, en, coll) => {
		destroy(en)
		if (!en.blocked){
			en.blocked = true
			setTimeout(function(){
				var xtNew = level.spawn(en.spawnBlock, en.gridPos.sub(0, 0))
			},200)	
		}
	})
	onCollide("player", "extralive", (pl, xt, coll) => {
		var diffy = pl.pos.y - xt.pos.y;
		console.log('colision',diffy, xt.frame)
		if (diffy<15 && xt.frame!=52 && !xt.collided){
			xt.collided = true
			destroy(xt)
			setTimeout(function(){
				var xtNew = level.spawn("P", xt.gridPos.sub(0, 0))
				xtNew.frame = xt.frame
				xtNew.collided = false
			},200)
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
		player.frame=1;
		if (player.grounded()) {
			player.jump(player.jumpPower);
		}
	});

	keyDown("left", () => {
		if (!player.movable) {
			return
		}
		if (player.grounded() && player.curAnim()!="move") {
			player.play("move");
		}
		player.flipX(true)
		player.move(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		if (!player.movable) {
			return
		}
		if (player.grounded() && player.curAnim()!="move") {
			player.play("move");
		}
		player.flipX(false)
		player.move(MOVE_SPEED, 0);
	});

});

scene("lose", ({ score, lives }) => {
	play("die")
	lives--
	if (lives>=0){
		add([
			sprite("player1a"),
			pos(width() / 2 - 20, height() / 4),
			scale(1.25),
			fixed(),
			origin("botleft"),
			layer("ui")
		]);
		add([
			text('x'+lives, {size:16,font:"sinko"}),
			origin("bot"),
			pos(width() / 2 + 10, height() / 4),
		]);
	}
	add([
		text('Score: '+score, {size:24,font:"sinko"}),
		origin("bot"),
		pos(width() / 2, height() / 2),
	]);
	if (lives==-1){
		add([
			text('Game Over', {size:24,font:"sinko"}),
			origin("bot"),
			pos(width() / 2, height() * 3 / 4),
		]);
		lives=2
		score=0	
	}
    keyDown("space", () => {
		go("main", {extraLives: lives, initialScore: score});
	});
});

scene("winlevel", ({ score, lives }) => {
	add([
		sprite("player1a"),
		pos(width() / 2 - 20, height() / 4),
		scale(1.25),
		fixed(),
		origin("botleft"),
		layer("ui")
	]);
	add([
		text('x'+lives, {size:16,font:"sinko"}),
		origin("bot"),
		pos(width() / 2 + 10, height() / 4),
	]);
	add([
		text('Score: '+score, {size:24,font:"sinko"}),
		origin("bot"),
		pos(width() / 2, height() / 2),
	]);
	add([
		text('Level Completed!', {size:24,font:"sinko"}),
		origin("bot"),
		pos(width() / 2, height() * 3 / 4),
	]);
    keyDown("space", () => {
		go("main", {extraLives: lives, initialScore: score});
	});
});

fetch("levels/"+currentLevel+".txt?"+Math.random())
	.then((response) => response.text())
	.then((text) => {
		levelMap = text
		go("main", {extraLives: 2, initialScore: 0})
		document.querySelector("canvas").focus()
	})
