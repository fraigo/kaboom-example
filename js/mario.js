window.kb = kaboom({
	global: true,
	width: 360,
	height: 360,
	scale: 2,
	background: [92, 148, 252,],
	fps: 12,
	plugins: [peditPlugin, asepritePlugin, kbmspritePlugin]
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
	sliceX: 7,
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
			from: 14,
			to: 17,
		},
		idle2: {
			from: 14,
			to: 14,
		},
		crouch2: {
			from: 20,
			to: 20,
		},
		jump2:{
			from: 19,
			to: 19
		},
		pole2:{
			from: 26,
			to: 26
		},
		move3: {
			from: 28,
			to: 31,
		},
		idle3: {
			from: 28,
			to: 28,
		},
		jump3:{
			from: 33,
			to: 33
		},
		pole3:{
			from: 40,
			to: 40
		},
		crouch3: {
			from: 34,
			to: 34,
		},
		death: {
			from: 6,
			to: 6
		}
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
loadSound("stage", "sounds/stage_clear.wav");
loadSound("1up", "sounds/1up.wav");
loadSound("star", "sounds/star.wav");
loadSound("pole", "sounds/pole.wav");

scene("main", ({ extraLives, initialScore }) => {

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
	const level = addLevel(map, {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 17,
		height: 17,
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
		"#": function () {
			return [
				sprite("tiles", { frame: 81 }),
				area(),
				solid(),
				origin("bot"),
				"brick",
				"block"
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
		"/": function () {
			return [
				sprite("tiles", { frame: 39 }),
				area(),
				solid(),
				origin("bot"),
				"pipetop"
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
				{ coins: 5, emptyFrame: 50 }
			]
		},
		"+": function () {
			return [
				sprite("goomba"),
				area({ width: 12, height: 16, offset: { x: -1, y: 0 } }),
				body(),
				solid(),
				origin("bot"),
				"goomba",
				"flip",
				"block",
				{ moving: false, moveDirection: -1 }
			]
		},
		"@": function () {
			return [
				sprite("tiles", { frame: 5 }),
				area(),
				body(),
				origin("bot"),
				"flip",
				"block",
				"mushroom",
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
				"live",
				{ moveDirection: 1 }
			]
		},
	});

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
	window.player = player1;

	function showPlayer(size) {
		player.size = size
		if (size==1){
			player.area.width=11
			player.area.height=16
			player.area.offset.x=0
			player.area.offset.y=-2
		}
		if (size==2 || size==3){
			player.area.width=12
			player.area.height=32
			player.area.offset.x=0
			player.area.offset.y=-2
		}
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
				level.spawn("@", obj.gridPos.sub(0, 1));
			} else {
				level.spawn("T", obj.gridPos.sub(0, 1));
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
				obj.frame = 83
				obj.pos.y -= 10;
				play("brick")
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
		if (obj.frame == 49) {
			play("bump")
		}
	}
	player1.on("headbutt", onHeadbutt);

	action("start", function (s) {
		console.log('start', s.pos.x, s.pos.y)
		player.pos.x = s.pos.x
		player.pos.y = s.pos.y
		destroy(s)
	})
	action("mushroom", function (p) {
		p.move(p.moveDirection * 50, 0)
		p.flipping = false
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})
	action("live", function (p) {
		p.move(p.moveDirection * 50, 0)
		p.flipping = false
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
	action("player", function (p) {
		// center camera to player
		camPos(p.pos);
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
			if (p.pos.y+p.area.offset.y == basepole) {
				p.flagDown = true
				setTimeout(function () {
					player.starMusic.pause()
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
		var diffx = Math.abs(player.pos.x - g.pos.x);
		if (diffx < 200 || g.moving) {
			g.moveBy(g.moveDirection, 0)
			g.moving = true
			g.flipping = false
		}
		var t = Math.round(time() * 10)
		g.frame = (t) % 2;
		if (g.timer) {
			g.timer--;
			if (g.timer == 0) {
				destroy(g)
			}
		}
		if (g.pos.y >= FALL_DEATH) {
			destroy(g)
		}
	})

	onCollide("flip", "block", (go, bl) => {
		if (bl.pos.y <= go.pos.y && !go.flipping) {
			go.moveDirection *= -1
			go.moveBy(go.moveDirection * 2, 0)
			go.flipX(go.moveDirection > 0)
			go.flipping = true
		}
	})
	onCollide("player", "polebottom", (p, m) => {
		p.flagPos = true
		player.movable = false
		player.jump(0)
		player.weight=0.2
		play("pole")
		player.play("pole" + player.size)
	});
	onCollide("player", "mushroom", (p, m) => {
		destroy(m);
		play("powerup1")
		showPlayer(2)
	});
	onCollide("player", "pipetop", (p1, p2) => {
		var diffy = p1.pos.y - p2.pos.y
		var diffx = p1.pos.x - p2.pos.x
		if (diffy < -16 && player.crouch) {
			//fix player position right`
			if (diffx < 0 && p2.frame == 38) {
				p1.pos.x = p2.pos.x + 3
			}
			//fix player position left
			if (diffx > 1 && p2.frame == 39) {
				p1.pos.x = p2.pos.x - 3
			}
			console.log('enter', diffx, p2)
			player.area.offset.y = -0.5
			player.z = -1
			var proc = 0
			p1.movable = false
			proc = setInterval(function () {
				p1.area.offset.y -= 0.5
				if (p1.area.offset.y <= -34) {
					if (!p1.movable) {
						p1.movable = true
						p1.area.offset.y = 0;
						clearInterval(proc)
						go("main", { extraLives: lives.value, initialScore: score.value })
					}
				}
			}, 100)

		}
	});
	onCollide("player", "flower", (p, m) => {
		destroy(m);
		play("powerup1")
		showPlayer(3)
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
			play("stomp")
			setTimeout(function () {
				p.jump(JUMP_FORCE/2)
			}, 20)
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
			console.log('crouch')
			player.play("crouch"+player.size);
			player.moveBy(0, -2);
			player.crouch = true;
			clearTimeout(player.downProc)
			player.downProc=setTimeout(function () {
				player.crouch = false;
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
