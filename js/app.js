const STEP_X = 101;
const STEP_Y = 83;

class Enemy {
    constructor(lv){
        this.sprite = 'images/enemy-bug.png';
        this.setLevel(lv);
        this.setValues();
    }

    setLevel(lv){
        this.level = lv * 100;
    }

    update(dt){
        if(this.posX > STEP_X * 6){
            this.setValues();
        }
        this.posX += this.speed * dt;
    }

    setValues(){
        this.posX = -2 * STEP_X;
        this.posY = 50 + ( Math.floor((Math.random() * 100) % 3) * STEP_Y );
        this.speed = this.level + Math.random()* 500;
    }
    
    render(){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
    }
}

class Player{
    constructor(sprite){
        this.sprite = sprite;
        this.hp = 5;
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

    winAnimation(){
        
    }

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.posX, this.posY);
        ctx.font = '20pt Impact';
        ctx.strokeStyle = "white";
        ctx.strokeText("HP: " + this.hp, 0, 30);
        ctx.fillText("HP: " + this.hp, 0, 30);
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

const createEnemies = function (num, lv){
    for(let i = 0; i < num; i++){
        allEnemies.push(new Enemy(lv));
    }
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
