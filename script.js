const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const count = document.getElementById("count");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
    return `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`;
}

class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width || (this.x - this.size) <= 0) {
            this.velX = -this.velX;
            this.color = randomRGB();
        }

        if ((this.y + this.size) >= height || (this.y - this.size) <= 0) {
            this.velY = -this.velY;
            this.color = randomRGB();
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
            if (this !== ball) {
                const dx = this.x - ball.x;
                const dy = this.y - ball.y;

                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + ball.size) {

                    const newColor = randomRGB();

                    this.color = newColor;
                    ball.color = newColor;

                    this.size = Math.min(this.size + 1, 40);
                    ball.size = Math.min(ball.size + 1, 40);
                }
            }
        }
    }
}

const balls = [];

function createBall(x = null, y = null) {

    const size = random(10, 20);

    balls.push(
        new Ball(
            x ?? random(size, width - size),
            y ?? random(size, height - size),
            random(-7, 7) || 3,
            random(-7, 7) || 3,
            randomRGB(),
            size
        )
    );

    count.textContent = balls.length;
}

// Initial balls
while (balls.length < 25) {
    createBall();
}

// Click to add ball
canvas.addEventListener("click", (event) => {
    createBall(event.clientX, event.clientY);
});

// Spacebar adds 5 balls
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {

        for (let i = 0; i < 5; i++) {
            createBall();
        }
    }
});

function loop() {

    // Motion trail effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.20)";
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();

// Responsive canvas
window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});