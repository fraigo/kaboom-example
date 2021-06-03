kaboom({
    global: true,
    width: 512,
    height: 512,
    scale: 2,
    clearColor:[0,0,0,1],
    plugins: [ peditPlugin, asepritePlugin, kbmspritePlugin ]
});
loadRoot("./");
loadSprite("pac1a", "images/pac1a.png");
loadSprite("pac1b", "images/pac1b.png");
loadSprite("pac2a", "images/pac2a.png");
loadSprite("pac2b", "images/pac2b.png");
loadSprite("coin1", "images/coin.png");
loadSound("score", "sounds/score.mp3");

scene("main", () => {
    gravity(980);
    var player = add([
        sprite("pac1a"),
        pos(30, 350),
        "player",
        scale(1),
        origin("center"),
        body(),
        {vel:100,main:"pac1a",alt:"pac1b",startx:30}
    ]);
    var player2 = add([
        sprite("pac2a"),
        pos(width()-30, 350),
        "player",
        scale(1),
        origin("center"),
        body(),
        {vel:100,main:"pac2a",alt:"pac2b",startx:width()-30}
    ]);
    var bottom=add([
        rect(width()-40, 12),
        pos(20, 380),
        origin("topleft"),
        solid(),
    ]);
    add([
        rect(80, 12),
        pos(200, 280),
        origin("topleft"),
        solid(),
    ]);
    add([
        rect(80, 12),
        pos(90, 160),
        origin("topleft"),
        solid(),
    ]);
    add([
        rect(30, 12),
        pos(470, 100),
        origin("topleft"),
        solid(),
    ]);
    add([
        rect(30, 12),
        pos(0, 100),
        origin("topleft"),
        solid(),
    ]);
    add([
        rect(70, 12),
        pos(340, 180),
        origin("topleft"),
        solid(),
    ]);
    add([
        rect(80, 12),
        pos(230, 60),
        origin("topleft"),
        solid(),
    ]);
    var score1 = add([
        text("0000", 24),
        pos(2, 2),
        {value:0}
    ]);
    var score2 = add([
        text("0000", 24),
        pos(width()-2, 2),
        origin("topright"),
        {value:0}
    ]);
    const JUMP_FORCE = 490;
    keyPress("up", () => {
        if (player.grounded()){
            player.jump(JUMP_FORCE);
            player.changeSprite("pac1b");
        }
    });
    keyPress("w", () => {
        if (player2.grounded()){
            player2.jump(JUMP_FORCE);
            player2.changeSprite("pac2b");
        }
    });
    keyDown("left", () => {
        player.scale.x=-1
        player.move(vec2(-player.vel,0))
    })
    keyDown("a", () => {
        player2.scale.x=-1
        player2.move(vec2(-player2.vel,0))
    })
    keyDown("right", () => {
        player.scale.x=1
        player.move(vec2(player.vel,0))
    })
    keyDown("d", () => {
        player2.scale.x=1
        player2.move(vec2(player2.vel,0))
    })
    action("player", function(p){
        if (Math.round(p.pos.x/8)%2==0){
            p.changeSprite(p.main);
        } else {
            p.changeSprite(p.alt);
        }
        if (p.pos.y>height()){
            p.pos.x=p.startx;
            p.pos.y=30;
        }
    })
    player.collides("coin", function(coin){
        score1.value += coin.points;
        score1.text = (""+(10000+score1.value)).substring(1);
        destroy(coin)
        play("score");
    })
    player2.collides("coin", function(coin){
        score2.value += coin.points;
        score2.text = (""+(10000+score2.value)).substring(1);
        destroy(coin)
        play("score");
    })
    loop(1, () => {
        var pt = Math.round(Math.random() * 4)
        add([
            sprite("coin1"),
            pos(Math.round(Math.random()*(width()-50))+25, 10),
            "coin",
            scale(0.20 + 0.20 * pt/2),
            origin("center"),
            body(),
            {points:pt}
        ]);
    });
});

scene("start", () => {
    add([
        text("Press space!", 24),
        origin("center"),
        pos(width() / 2, height() / 2),
    ]);
    keyPress("space", () => {
        go("main")
    });
})

scene("gameover", () => {
    keyPress("space", () => {
        go("start")
    });
})

start("start");