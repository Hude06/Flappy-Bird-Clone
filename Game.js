import {Rect} from "./RectUtils.js";
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let currentKey = new Map();
let score = 0;
let beat = new Audio('./Song.mp3');
class Bird {
    constructor() {
        this.alive = true;
        this.bounds = new Rect(10,10,48,36)
        this.velocity = 0.1;
        this.gravity = 0.1;
        this.image = new Image();
        this.image.src = "./Bird.png";
    }
    draw() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.image,this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        this.velocity += this.gravity;
        this.bounds.y += this.velocity;
    }
}
class TopWall {
    constructor() {
        this.bounds = new Rect(500,0,20,150);
        this.speed = 1;
    }
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        this.bounds.x -= this.speed;
    }
    EdgeCollison() {
        if (this.bounds.x <= 0) {
            this.bounds.x = 510       ;
        }
    }

} 
class BottomWall {
    constructor() {
        this.bounds = new Rect(500,300,20,800);
        this.speed = 1;
    }
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        this.bounds.x -= this.speed;
    }
    EdgeCollison() {
        if (this.bounds.x <= 0) {
            this.bounds.x = 510;
        }
    }

}
let flapPower = 10;
function DrawFlapPower() {
    ctx.fillStyle = "black"
    ctx.fillRect(10,10,100,20) 
    ctx.fillStyle = "green"
    ctx.fillRect(10,10,flapPower*10,20)
}
let bottomWall = new BottomWall();
let topWall = new TopWall();
let bird = new Bird();
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function keyboardLoop() {
    if(currentKey.get(" ") && bird.alive && flapPower > 0) {
        bird.velocity -= 3
        flapPower -= 1;
    } else {
        if (flapPower <= 10) {
        flapPower += 0.02
        }
    }
}
function Collison() {
    score += 0.001
    if (bird.bounds.intersects(topWall.bounds)) {
        bird.alive = false;
    }
    if (bird.bounds.intersects(bottomWall.bounds)) {
        bird.alive = false;
    } 
    if (bird.bounds.y >= 860) {
        bird.bounds.y = 860
        bird.alive = false;
    }
}
let image = new Image();
image.src = "./BackGround.png"
function DrawScrollBackground() { 
    ctx.drawImage(image,0,0,288*2,512*2);
}
function loop() {
    beat.play();
    keyboardLoop();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    DrawScrollBackground();
    bird.draw();
    topWall.draw();
    bottomWall.draw();
    bird.update();
    topWall.update();
    bottomWall.update();
    bottomWall.EdgeCollison();
    topWall.EdgeCollison();    
    Collison();
    DrawFlapPower();
    document.getElementById("Score").innerHTML = Math.round(score);
    currentKey.clear();
    requestAnimationFrame(loop);
}
function init() {
    keyboardInit();
    loop();
}
init();