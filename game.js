const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Paddle settings
const paddleWidth = 12;
const paddleHeight = 80;
const paddleMargin = 20;

// Ball settings
const ballSize = 16;

// Game objects
let leftPaddle = {
    x: paddleMargin,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let rightPaddle = {
    x: canvas.width - paddleMargin - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    dx: 6 * (Math.random() < 0.5 ? 1 : -1),
    dy: 4 * (Math.random() < 0.5 ? 1 : -1),
    size: ballSize
};

let scoreLeft = 0;
let scoreRight = 0;

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = '#eee';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ff6';
    ctx.fill();
    ctx.closePath();

    // Draw middle line
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 4;
    ctx.setLineDash([16, 16]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Update positions
function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top/bottom)
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size >= canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.dy *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.x + ball.size >= leftPaddle.x &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1;
        ball.dy += leftPaddle.dy * 0.3;
    }

    // Right paddle collision
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.x <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1;
        ball.dy += rightPaddle.dy * 0.3;
    }

    // Score
    if (ball.x < 0) {
        scoreRight++;
        resetBall();
    }
    if (ball.x + ball.size > canvas.width) {
        scoreLeft++;
        resetBall();
    }

    // Right paddle AI (track ball)
    let target = ball.y + ball.size / 2 - rightPaddle.height / 2;
    let diff = target - rightPaddle.y;
    rightPaddle.dy = Math.sign(diff) * Math.min(5, Math.abs(diff) / 8);
    rightPaddle.y += rightPaddle.dy;

    // Clamp right paddle
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;

    // Update score
    document.getElementById('score-left').textContent = scoreLeft;
    document.getElementById('score-right').textContent = scoreRight;
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    leftPaddle.dy = mouseY - (leftPaddle.y + leftPaddle.height / 2);

    // Clamp
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
});

// Reset ball position after score
function resetBall() {
    ball.x = canvas.width / 2 - ball.size / 2;
    ball.y = canvas.height / 2 - ball.size / 2;
    ball.dx = 6 * (Math.random() < 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() < 0.5 ? 1 : -1);
}

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();