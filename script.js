const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800; // Match the CSS width
canvas.height = 500; 

let paddleHeight = 75; // Making the paddle taller for vertical orientation
let paddleWidth = 10; // Thinner width for vertical orientation
let paddleYLeft = (canvas.height - paddleHeight) / 2; // Centering the left paddle vertically
let paddleYRight = (canvas.height - paddleHeight) / 2; // Centering the right paddle vertically

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

let scoreLeft = 0;
let scoreRight = 0;

function drawScoreboard() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Player 2: " + scoreLeft, 20, 20); 
    ctx.fillText("Player 1: " + scoreRight, canvas.width - 100, 20); 
}
function keyDownHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = true;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = true;
    } else if (e.key === "w" || e.key === "W") {
        wPressed = true;
    } else if (e.key === "s" || e.key === "S") {
        sPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "Up" || e.key === "ArrowUp") {
        upPressed = false;
    } else if (e.key === "Down" || e.key === "ArrowDown") {
        downPressed = false;
    } else if (e.key === "w" || e.key === "W") {
        wPressed = false;
    } else if (e.key === "s" || e.key === "S") {
        sPressed = false;
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawPaddles() {
    // Left Paddle
    ctx.beginPath();
    ctx.rect(0, paddleYLeft, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    // Right Paddle
    ctx.beginPath();
    ctx.rect(canvas.width - paddleWidth, paddleYRight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddles();
    drawScoreboard();

    if (wPressed) {
        paddleYLeft = Math.max(paddleYLeft - 5, 0);
    } else if (sPressed) {
        paddleYLeft = Math.min(paddleYLeft + 5, canvas.height - paddleHeight);
    }

    if (upPressed) {
        paddleYRight = Math.max(paddleYRight - 5, 0);
    } else if (downPressed) {
        paddleYRight = Math.min(paddleYRight + 5, canvas.height - paddleHeight);
    }

    requestAnimationFrame(draw);
}

draw();