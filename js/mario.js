window.kb = kaboom({
	global: true,
    width: 360,
    height: 360,
    scale: 2,
	background: [0, 0, 0, 1],
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
loadSprite("player1a", "images/player1a.png", {
	sliceX: 3,
	anims: {
		move: {
			from: 0,
			to: 2,
		},
		idle: {
			from: 0,
			to: 0,
		},
	},
});
loadSprite("player1b", "images/player1b.png", {
	sliceX: 3,
	anims: {
		move: {
			from: 0,
			to: 2,
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

scene("main", () => {

	// define some constants
	const JUMP_FORCE = 360;
	const MOVE_SPEED = 120;
	const FALL_DEATH = 640;

	// define layers, draw "ui" on top, and "game" is the default layer
	layers([
		"game",
		"ui",
	], "game");

	// add level to scene
	var map = levelMap.split('\n')
	console.log('map', map)
	const level = addLevel(map, {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 17,
		height: 17,
		// define each object as a list of components
		"=": function() { return [
			sprite("tiles",{frame: 81}),
			area(),
			solid(),
			origin("bot"),
			"tile"
		]},
		"#": function() { return [
			sprite("tiles",{frame: 82}),
			area(),
			solid(),
			origin("bot"),
			"brick"
		]},
		"X": function() { return [
			sprite("tiles",{frame: 112}),
			area(),
			solid(),
			origin("bot"),
			"floor"
		]},
		"[": function() { return [
			sprite("tiles",{frame: 54}),
			area(),
			solid(),
			origin("bot"),
			"pipebottom"
		]},
		"]": function() { return [
			sprite("tiles",{frame: 55}),
			area(),
			solid(),
			origin("bot"),
			"pipebottom"
		]},
		".": function() { return [
			sprite("tiles",{frame: 21}),
			area(),
			solid(),
			origin("bot"),
			"poletop"
		]},
		"<": function() { return [
			sprite("tiles",{frame: 40}),
			area(),
			solid(),
			origin("botleft"),
			"flag"
		]},
		"|": function() { return [
			sprite("tiles",{frame: 37}),
			area(),
			solid(),
			origin("bot"),
			"polebottom"
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
			{coins: 5}
		]},
		"+": function() { return [
			sprite("goomba"),
			area(),
			body(),
			origin("bot"),
			"goomba",
			{moving: false}
		]},
		"@": function() { return [
			sprite("tiles",{frame:4}),
			area(),
			body(),
			origin("bot"),
			"mushroom",
		]},
	});

	// add score counter obj
	const score = add([
		text("0",{size:20,font:"sinko"}),
		pos(20,30),
		fixed(),
		origin("botleft"),
		layer("ui"),
		{
			value: 0,
		},
	]);

	// define player object
	var player1a = add([
		sprite("player1a"),
		origin("bot"),
		layer("game"),
		pos(10, 5),
		scale(1),
		area({width: 10, height: 16, offset: {x:-1, y:0}}),
		body(),
		"player",
		{size:1, jumpPower: JUMP_FORCE}
	]);
	var player1b = add([
		sprite("player1b"),
		origin("bot"),
		layer("game"),
		pos(10, 5),
		scale(1),
		area({width: 12, height: 30, offset: {x:-1, y:0}}),
		body(),
		"player",
		{size:2, jumpPower: JUMP_FORCE * 1.5}
	]);
	player1b.hidden = true;
	player1b.solid = false;
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
			go("lose", { score: score.value, });
		}
	});

	// if player collides with any obj with "dangerous" tag, lose
	player.collides("dangerous", () => {
		go("lose", { score: score.value, });
	});

	// grow an mushroom if player's head bumps into an obj with "prize" tag
	var onHeadbutt = (obj) => {
		if (obj.is("grow") && obj.frame==48) {
			play("powerup0")
			obj.frame=49;
			level.spawn("@", obj.gridPos.sub(0, 1));
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
			if (obj.coins == 0){
				obj.frame=49;
				return
			}
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
		}
		if (obj.frame==49) {
			play("bump")
		}
	}
	player1a.on("headbutt", onHeadbutt);
	player1b.on("headbutt", onHeadbutt);

	action("mushroom", function(p){
		p.move(50,0)
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})
	action("goomba", function(p){
		var diffx=Math.abs(player.pos.x-p.pos.x);
		if (diffx<200 || p.moving){
			p.pos.x-=1
			p.moving = true
		}
		if (p.frame<2){
			var t = Math.round(time()*10)
			p.frame=(t)%2;	
		} else {
			p.timer--;
			if (p.timer==0){
				destroy(p)
			}
		}
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})

	// player grows big collides with an "mushroom" obj
	onCollide("player", "mushroom", (p, m) => {
		destroy(m);
		// as we defined in the big() component
		// player.biggify(3);
		play("powerup1")
		showPlayer(player1b)
	});

	onCollide("player", "goomba", (p, g) => {
		var diffy = p.pos.y-g.pos.y
		if(g.frame<2 && diffy<0){
			play("stomp")
			g.frame=2
			g.timer=10
		} else {
			destroy(g);
			if (p.size==2){
				play("pipe")
				showPlayer(player1a)
			} else {
				go("lose", { score: score.value, });
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
		player.frame=1;
		if (player.grounded()) {
			player.jump(player.jumpPower);
		}
	});

	keyDown("left", () => {
		if (player.grounded()) {
			var t = Math.round(time()*20)
			player.frame=(t)%3;
		}
		player.flipX(true)
		player.move(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		if (player.grounded()) {
			var t = Math.round(time()*20)
			player.frame=(t)%3;
		}
		player.flipX(false)
		player.move(MOVE_SPEED, 0);
	});

});

scene("lose", ({ score }) => {
	play("die")
	add([
		text('Score: '+score, {size:24,font:"sinko"}),
		origin("bot"),
		pos(width() / 2, height() / 2),
	]);
    keyDown("space", () => {
		go("main");
	});
});

fetch("levels/"+currentLevel+".txt?"+Math.random())
	.then((response) => response.text())
	.then((text) => {
		levelMap = text
		go("main")
		document.querySelector("canvas").focus()
	})
