// set up the 2d canvas
// get a reference to the canvas and call getContext() method / ctx is the object drawing area

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number of bouncy balls
function random(min, max){
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// model the ball's starting x&y coords and veloxity x&y coords for animation
function Ball (x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

// draw the ball
Ball.prototype.draw = function(){
    ctx.beginPath();                                        //draw a shape on canvas
    ctx.fillStyle = this.color;                             //define color of the shape
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);     //arc and radius of bouncing
    ctx.fill();                                             //finish drawing the path
}

// create a test case on browser console of all code above this comment
// let testBall = new Ball(50, 100, 4, 4, 'blue', 10)
// then you can call each case to test in the console such as test.Ball.x and see console output.
// drawing the ball function draws the ball only, it doesn't move the ball

// update balls data to make it move
// include size of the ball in calculation as x&y coords are center of ball and using ballEdge just looks better
Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {                //check if ball has reached edge for all x & y
        this.velX = -(this.velX);                       //if at edge reverse travel direction of ball with positive vel being up / negative vel is down
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;                                //add the velX to the x coord
    this.y += this.velY;                                //add the velY to the y coord
}

// collision detector - just a simple collision detector
// for each ball check every other ball to see if it has collided with the current ball
// forLoop loops thru balls in the array
// ! is to negate the check so code in if statement only runs if balls are not the same ball
Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if(!(this === balls[j])) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0,255) + ',' + random(0,255) +')';  //constructing random r-g-b remembering color wants a string
            }
        }
    }
};

// animating the ball
// create somewhere to store all our balls, then populate
let balls = [];

// while loop creates new instance of ball() using random() value function, then push()es 
//  to end of balls array but only while number of balls in array is less than 25.
while (balls.length < 25) {
    let size = random(10,20);
    let ball = new Ball(
        // ball position always drawn at least 1ball width
        // away from edge of canvas to avoid drawing errors
        random(0 + size,width - size),
        random(0 + size,height - size),
        random(-7,7),
        random(-7,7),
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')', size
    );
    balls.push(ball);
}

// animation loop to update and render - color is set to semi-transparent black
// fillRect() handles so you don't get long snakes worming across the canvas
// the semi-transparent rgba 0.25 allows previous few frames to shine thru slightly producing little trails behind balls as they move
//  hint - to remove the ball trails, adjust the color to say 1 etc.
function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);                        //rinse and repeat animation -the function recursively calls itselt every time it runs over and over
}

loop();


