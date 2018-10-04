const Engine = (function(global) {

    const doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d');
    let lastTime,
        bestOfAll = 0,
        newRecordText = "",
        isRunning = true;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    if(localStorage.getItem("lastname")){
        bestOfAll = localStorage.getItem("lastname");
    }

    document.addEventListener('keyup', function(e) {
        if (e.key === " " || e.key === "SpaceBar"){
            if(!isRunning){
                chooseHero();
            }
        }
    });

    function main() {
        const now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        update(dt);
        render();
        lastTime = now;

        if(isRunning){
            win.requestAnimationFrame(main);
        } else {
            gameOverScreen();
        }
    }

    function chooseHero(){
        const heroSprite = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];
        isRunning = true;

        const gradient=ctx.createLinearGradient(0,0,0,canvas.height);
        gradient.addColorStop("0.2","rgb(82, 106, 213)");
        gradient.addColorStop("0.5","rgb(210, 210, 200)");
        gradient.addColorStop("0.6","rgb(210, 210, 200)");
        gradient.addColorStop("0.8","rgb(95, 193, 72)");


        (function chooseLoop(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = gradient;
            ctx.fillRect(0,50,canvas.width,canvas.height-100);

            selector.render();
    
            heroSprite.forEach((sprite, index) => {
                ctx.drawImage(Resources.get(sprite), index * 101, 2 * 83);
            });

            drawText("SELECT YOUR PLAYER", canvas.width/2, 150, "center", 24,"yellow", "black");
            drawText("Use \u21D0 and \u21D2 arrows to select", canvas.width/2, 400, "center", 14);
            drawText("and press ENTER to start the game.", canvas.width/2, 430, "center", 14);
            drawText("Use \u21D0 \u21D1 \u21D2 \u21D3 arrows to play.", canvas.width/2, 490, "center", 14);
    
            if(selector.isReady){
                createPlayer(heroSprite[selector.selected]);
                init();
            } else {
                win.requestAnimationFrame(chooseLoop);
            }
        })();
    }

    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    function renderGameStatus(){
        let hpPosX = 0;
        for(let i = 0; i < player.hp; i++){
            drawText("\u2764", hpPosX, 35, "start", 25,"red", "pink");
            hpPosX += 33;
        }
        drawText("SCORE: " + player.score, canvas.width/2, 30, "center", 20);
        drawText("BEST: " + bestOfAll, canvas.width-5, 28, "end", 14,"yellow","black");
        drawText("LEVEL: " + player.level, canvas.width / 2, canvas.height - 35, "center", 18,"red","white");
    }

    function drawText(text, tPosX, tPosY, tAlign, tFontSize, tFillStyle = "black", tStrokeStyle = "white"){
        ctx.textAlign = tAlign;
        ctx.lineWidth = 2;
        ctx.font = tFontSize + "pt impact";
        ctx.strokeStyle = tStrokeStyle;
        ctx.fillStyle = tFillStyle;
        ctx.strokeText(text, tPosX, tPosY);
        ctx.fillText(text, tPosX, tPosY);
    }

    function checkCollisions(){
        allEnemies.forEach(function (enemy){
            if(enemy.posY === player.posY){
                if(enemy.posX + STEP_X - 25 > player.posX 
                    && enemy.posX + STEP_X - 25 < player.posX + STEP_X){
                    if(player.hp>0){
                        player.gotHit();
                        player.toStartPos();
                    } else {
                        if(player.score > bestOfAll){
                            bestOfAll = player.score;
                            newRecordText = "NEW RECORD!"
                            localStorage.setItem("bestScore", bestOfAll);
                        }
                        isRunning = false;
                    }
                }
            }
        });

        if(player.posX === gem.posX){
            if(player.posY === gem.posY){
                player.score += gem.value;
                gem.hide();
            }
        }
    }

    function gameOverScreen(){
        const imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        const numPixels = imageData.data.length / 4;
        for (let i = 0; i < numPixels; i++) {
            const value =(imageData.data[i * 4] + 
                imageData.data[i * 4 + 1] + 
                imageData.data[i * 4 + 2]) / 3;
            if(value < 255){
                imageData.data[i * 4] = value;
                imageData.data[i * 4 + 1] = value;
                imageData.data[i * 4 + 2] = value;
            } 
        }
        ctx.putImageData(imageData,0,0);

        drawText("GAME OVER", canvas.width/2, canvas.height/2, "center", 50);
        drawText("PRESS *SPACE* TO RESTART", canvas.width/2, canvas.height/2 + 30,"center", 20,"red");

        drawText(newRecordText, canvas.width/2, canvas.height/2 + 90,"center", 20,"yellow", "black");
    }

    function render() {
        var rowImages = [
                'images/water-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/stone-block.png',
                'images/grass-block.png',
                'images/grass-block.png'
            ],
            numRows = 6,
            numCols = 5,
            row, col;
        
        ctx.clearRect(0,0,canvas.width,canvas.height)

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        renderEntities();
    }

    function renderEntities() {
        gem.render();
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
        player.render();
        renderGameStatus();
    }

    function reset() {
        player.reset();
        resetEnemies();
        selector.isReady = false;
        newRecordText = "";
        isRunning = true;
    }

    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug-l.png',
        'images/enemy-bug-r.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Selector.png',
        'images/gem-blue.png',
        'images/gem-green.png',
        'images/gem-orange.png',
        
    ]);
    Resources.onReady(chooseHero);
    global.ctx = ctx;
})(this);
