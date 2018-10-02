const STEP_X = 101;
const STEP_Y = 83;

class Enemy {
    constructor(lv){
        
        this.level = 1000;
        this.setValues();
    }

    update(dt){
        if(this.posX > STEP_X * 7 ||
            this.posX < STEP_X * -3){
            this.setValues();
        }
        this.posX += this.speed * dt;
    }

    setValues(){
        
        this.posY = 50 + ( Math.floor((Math.random() * 100) % 3) * STEP_Y );
        if(this.posY === 50 + STEP_Y ){
            this.sprite = 'images/enemy-bug-l.png';
            this.posX = 6 * STEP_X;
            this.direction = -1;
        } else {
            this.sprite = 'images/enemy-bug-r.png';
            this.posX = -2 * STEP_X;
            this.direction = 1;
        }        
        this.speed = (this.level + Math.random()* 500) * this.direction;
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}

class Player{
    constructor(sprite){
        this.sprite = sprite;
        this.hp = 5;
        this.score = 0;
        this.toStartPos();
    }

    toStartPos(){
        this.x = 2;
        this.y = 5;
    }

    update(){
        this.posX = STEP_X * this.x;
        this.posY = STEP_Y * this.y - 33;
    }

    gotHit(){
        if(this.hp > 0){
            this.hp -= 1; 
        } else {
            //game over
        }
    }

    winAnimation(dt){

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
                } else {
                    this.score +=1;
                    this.toStartPos();
                }
                break;
            case "down":
                if(this.y < 5){
                    this.y += 1;
                }
                break
            default: 
        }
    }

}

function createEnemies(num, lv){
    for(let i = 0; i < num; i++){
        allEnemies.push(new Enemy(lv));
    }
}

function enemiesLevelUp(){
    allEnemies.forEach(function(enemy){
        enemy.level += 100;
    });
}

const heroSprite = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

const player = new Player(heroSprite[1]);
const allEnemies = [];
createEnemies(3,10);

document.addEventListener('keydown', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
