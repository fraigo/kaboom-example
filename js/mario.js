kaboom({
	global: true,
    width: 360,
    height: 360,
    scale: 2,
	clearColor: [0, 0, 0, 1],
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
loadSound("jump", "sounds/jump_small.wav");
loadSound("coin", "sounds/smb_coin.wav");
loadSound("powerup0", "sounds/smb_powerup_appears.wav");
loadSound("powerup1", "sounds/smb_powerup.wav");

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

	// camera will ignore "ui" layer
	camIgnore([ "ui", ]);

	// add level to scene
	const level = addLevel(levelMap.split('\n'), {
		// TODO: derive grid size from sprite size instead of hardcode
		// grid size
		width: 17,
		height: 17,
		// define each object as a list of components
		"=": [
			sprite("tiles",{frame: 81}),
			solid(),
		],
		"$": [
			sprite("tiles",{frame: 32}),
			"coin",
		],
		"^": [
			sprite("tiles",{frame:106}),
			solid(),
			"jumpy",
		],
		"%": [
			sprite("tiles",{frame:48}),
			solid(),
			"grow",
		],
		"*": [
			sprite("tiles",{frame:48}),
			solid(),
			"coiner",
			{coins: 5}
		],
		"#": [
			sprite("tiles",{frame:4}),
			body(),
			"apple",
		],
	});

	// add score counter obj
	const score = add([
		text("0"),
		pos(6, 6),
		layer("ui"),
		{
			value: 0,
		},
	]);

	// define a custom component that handles player grow big logic
	function big() {
		let timer = 0;
		let isBig = false;
		return {
			update() {
				if (isBig) {
					timer -= dt();
					if (timer <= 0) {
						this.smallify();
					}
				}
			},
			isBig() {
				return isBig;
			},
			smallify() {
				this.scale = vec2(1);
				timer = 0;
				isBig = false;
			},
			biggify(time) {
				this.scale = vec2(2);
				timer = time;
				isBig = true;
			},
		};
	}

	// define player object
	const player = add([
		sprite("player1a"),
		origin("center"),
		pos(10, 0),
		scale(1),
		// makes it fall to gravity and jumpable
		body(),
		// as we defined above
		big(),
	]);

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

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.on("headbump", (obj) => {
		if (obj.is("grow") && obj.frame==48) {
			play("powerup0")
			obj.frame=49;
			level.spawn("#", obj.gridPos.sub(0, 1));
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
	});

	action("apple", function(p){
		p.move(80,0)
		if (p.pos.y >= FALL_DEATH) {
			destroy(p)
		}
	})

	// player grows big collides with an "apple" obj
	player.collides("apple", (a) => {
		destroy(a);
		// as we defined in the big() component
		// player.biggify(3);
		play("powerup1")
		player.changeSprite("player1b");
	});

	player.collides("jumpy", (obj) => {
		player.frame=1;
		player.jump(JUMP_FORCE * 1.5);
	});

	// increase score if meets coin
	player.collides("coin", (c) => {
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
			player.jump(JUMP_FORCE);
		}
	});

	keyDown("left", () => {
		if (player.grounded()) {
			var t = Math.round(time()*20)
			player.frame=(t)%3;
		}
		player.scale.x=-1
		player.move(-MOVE_SPEED, 0);
	});

	keyDown("right", () => {
		if (player.grounded()) {
			var t = Math.round(time()*20)
			player.frame=(t)%3;
		}
		player.scale.x=1
		player.move(MOVE_SPEED, 0);
	});

});

scene("lose", ({ score }) => {
	add([
		text('Score: '+score, 32),
		origin("center"),
		pos(width() / 2, height() / 2),
	]);
    keyDown("space", () => {
		go("main");
	});
});

start("main");
