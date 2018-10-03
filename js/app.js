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

    render(){
        ctx.drawImage(Resources.get(this.selectorSprite), this.selected * 101, 2 * 83);
    }


}

class Enemy {
    constructor(){      
        this.level = 100;
        this.setValues();
        this.levelUp = false;
    }

    update(dt){
        if(this.posX > STEP_X * 7 ||
            this.posX < STEP_X * -3){
            this.setValues();
        }
        this.posX += this.speed * dt;
    }

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
        this.speed = (this.level + randomNumber(100)) * this.direction;
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}

class Player{
    constructor(){
        this.reset();
    }

    toStartPos(){
        this.x = 2;
        this.y = 5;
    }

    reset(){
        this.hp = 5;
        this.score = 0;
        this.toStartPos();
    }

    update(){
        this.posX = STEP_X * this.x;
        this.posY = STEP_Y * this.y - 33;
    }

    gotHit(){
        if(this.hp > 0){
            this.hp -= 1; 
        }
    }

    render(){
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
                    console.log("up");
                } else {
                    this.score +=1;
                    if(this.score > 0 &&
                        this.score % 5 === 0){
                        increaseEnemyLevel();
                    }
                    this.toStartPos();
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

function createEnemies(num){
    for(let i = 0; i < num; i++){
        allEnemies.push(new Enemy);
    }
}

function increaseEnemyLevel(){
    allEnemies.forEach(function(enemy){
        enemy.level += 50;        
    });
}

function resetEnemies(){
    allEnemies.forEach(function(enemy){
        enemy.level = 100;
    });
}

function createPlayer(sprite){
    player.sprite = sprite;
}

function randomNumber(num){
    return Math.floor((Math.random() * 100) % num);
}

let selector = new Selector;
let player = new Player;
const allEnemies = [];
createEnemies(3,1);

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