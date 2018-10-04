const STEP_X = 101;
const STEP_Y = 83;

class Selector {
    constructor(){
        this.selectorSprite = 'images/Selector.png';
        this.selected = 2;
        this.isReady = false;
    }
    handleInput(pressedKey){
        switch(pressedKey){
            case "left":
                if(this.selected > 0){
                    this.selected -= 1;
                }
                break;
            case "right":
                if(this.selected < 4){
                    this.selected += 1;
                }
                break;
            case "enter":
                this.isReady = true;
                break;
            default: 
        }
    }
    render(ctx){
        ctx.drawImage(Resources.get(this.selectorSprite), this.selected * 101, 2 * 83);
    }
}

class Enemy {
    constructor(){    
        this.level = 1;  
        this.setValues();
    }

    setLevel(lv){
        this.level = lv;
    }

    //atualiza a posição do inimigo no canvas.
    update(dt){
        
        if(this.posX > STEP_X * 7 ||
            this.posX < STEP_X * -3){
            this.setValues();
        }
        this.posX += this.speed * dt;
    }

    //insere ou reinsere a inimigo em sua posição inicial.
    setValues(){
        this.posY = randomNumber(3) * STEP_Y + 50;
        if(this.posY === STEP_Y + 50 ){
            this.sprite = 'images/enemy-bug-l.png';
            this.posX = 6 * STEP_X;
            this.direction = -1;
        } else {
            this.sprite = 'images/enemy-bug-r.png';
            this.posX = -2 * STEP_X;
            this.direction = 1;
        }        
        this.speed = (this.level * 100 + randomNumber(100)) * this.direction;
    }
    
    render(ctx){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}

class Player{
    constructor(){
        this.reset();
        this.level = 1;
    }

    //Coloca o jogador em sua posição inicial no canvas.
    toStartPos(){
        this.x = 2;
        this.y = 5;
    }

    reset(){
        this.hp = 5;
        this.score = 0;
        this.level = 1;
        this.toStartPos();
    }

    //Atualiza a posição do jogador
    update(){
        this.posX = STEP_X * this.x;
        this.posY = STEP_Y * this.y - 33;
    }

    //Contabiliza os danos recebidos pelo jogador.
    gotHit(){
        if(this.hp > 0){
            this.hp -= 1; 
        }
    }

    render(ctx){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }

    handleInput(pressedKey){
        switch(pressedKey){
            case "left":
                if(this.x > 0){
                    this.x -= 1;
                }
                break;
            case "right":
                if(this.x < 4){
                    this.x += 1;
                }
                break;
            case "up":
                if(this.y >= 1 ){
                    this.y -= 1;
                } else {
                    /*Caso o jogador atinja a parte superior do mapa, aumenta-se um ponto.
                    A cada 20 pontos o level do jogador é aumentado, 
                    o que reflete na velocidade dos inimigos.*/
                    this.score +=1;
                    this.level = 1 + Math.floor(this.score / 20);
                    setEnemiesLevel(this.level);
                    this.toStartPos();
                    gem.setValues();
                }
                break;
            case "down":
                if(this.y < 5){
                    this.y += 1;
                }
                break;
            default: 
        }
    }

}

class Gem {
    constructor(){
        this.setValues();
    }

    setValues(){
        const rand = randomNumber(100);
        if(rand < 70){
            this.sprite = 'images/gem-blue.png';
            this.value = 1;
        } else if(rand > 98) {
            this.sprite = 'images/gem-orange.png';
            this.value = 10;
        } else {
            this.sprite = 'images/gem-green.png';
            this.value = 5;
        }

        this.posX = randomNumber(5) * STEP_X;
        this.posY = randomNumber(3) * STEP_Y + 50;
    }

    hide(){
        this.posX = 6 * STEP_X;
    }

    render(ctx){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}

function createPlayer(sprite){
    player.sprite = sprite;
}

function createEnemies(num){
    for(let i = 0; i < num; i++){
        allEnemies.push(new Enemy);
    }
}

function setEnemiesLevel(lv){
    allEnemies.forEach(function(enemy){
        enemy.setLevel(lv);
    });
}

function resetEnemies(){
    allEnemies.forEach(function(enemy){
        enemy.setLevel(1);
    });
}

function randomNumber(num){
    return Math.floor((Math.random() * 100) % num);
}

const selector = new Selector;
const player = new Player;
const gem = new Gem;
const allEnemies = [];
createEnemies(3);

document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        "ArrowLeft": 'left',
        "ArrowUp": 'up',
        "ArrowRight": 'right',
        "ArrowDown": 'down'
    };

    player.handleInput(allowedKeys[e.key]);
});

document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        "ArrowLeft": 'left',
        "ArrowRight": 'right',
        "Enter": 'enter'
    };
    selector.handleInput(allowedKeys[e.key]);
});