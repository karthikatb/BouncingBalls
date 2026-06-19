const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const count = document.getElementById("count");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRGB() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
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
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
      this.color = randomRGB();
    }

    if (this.y + this.size >= height || this.y - this.size <= 0) {
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

          this.size = Math.min(this.size + 0.05, 40);
          ball.size = Math.min(ball.size + 0.05, 40);
        }
      }
    }
  }
}

const balls = [];

function updateCounter() {
  count.textContent = balls.length;
}

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

  updateCounter();
}

// Improved remove ball function
function removeBall(event) {
  const rect = canvas.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let i = 0; i < balls.length; i++) {
    const dx = mouseX - balls[i].x;
    const dy = mouseY - balls[i].y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = i;
    }
  }

  if (closestDistance < 30) {
    balls.splice(closestIndex, 1);
    updateCounter();
  }
}

// Create initial balls
while (balls.length < 25) {
  createBall();
}

// Left click = add ball
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();

  createBall(
    event.clientX - rect.left,
    event.clientY - rect.top
  );
});

// Right click = remove nearest ball
canvas.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  removeBall(event);
});

// Keyboard controls
document.addEventListener("keydown", (event) => {

  // Space = add 5 balls
  if (event.code === "Space") {
    event.preventDefault();

    for (let i = 0; i < 5; i++) {
      createBall();
    }
  }

  // Backspace = remove 5 balls
  if (event.code === "Backspace") {
    event.preventDefault();

    for (let i = 0; i < 5 && balls.length > 0; i++) {
      balls.pop();
    }

    updateCounter();
  }
});

function loop() {
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

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
