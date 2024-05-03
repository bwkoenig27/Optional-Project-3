const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800; 
canvas.height = 500; 

let paddleHeight = 75; // Making the paddle taller for vertical orientation
let paddleWidth = 10; // Thinner width for vertical orientation
let paddleYLeft = (canvas.height - paddleHeight) / 2; 
let paddleYRight = (canvas.height - paddleHeight) / 2; 

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

let scoreLeft = 0;
let scoreRight = 0;

let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let dx = 2; // Velocity in the x direction
let dy = 2; // Velocity in the y direction

let scoreEffectActive = false;
let scoreEffectRadius = 0;
let maxScoreEffectRadius = 50; // Maximum size of the circle effect
let scoreEffectOpacity = 1.0;

let animationFrameId = null;

function drawScoringEffect(player) {
    const flashDuration = 500; 
    const flashColor = player === "player1" ? "#00FF00" : "#FF0000";
    ctx.fillStyle = flashColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas after flash duration
    }, flashDuration);
    const scoreboardColor = player === "player1" ? "#00FF00" : "#FF0000";
}


const newGameButton = document.getElementById('newGameButton');

newGameButton.addEventListener('click', function() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }

    // Reset scores and positions
    scoreLeft = 0;
    scoreRight = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    dx = 2;
    dy = 2;
    paddleYLeft = (canvas.height - paddleHeight) / 2;
    paddleYRight = (canvas.height - paddleHeight) / 2;

    // Countdown before starting
    let countdown = 3;
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddles();
        drawBall();
        drawScoreboard();
        ctx.font = "40px 'Press Start 2P', cursive";
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2 - 50);
        if (countdown-- <= 0) {
            clearInterval(countdownInterval);
            draw(); // Start the game loop after the countdown
        }
    }, 1000);
});

const pausePlayButton = document.getElementById('pauseButton');

pausePlayButton.addEventListener('click', function() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);  // Pause the game
        animationFrameId = null;
        pausePlayButton.textContent = "Resume";  // Change button text to "Play Game"
    } else {
        draw();  // Resume the game
        pausePlayButton.textContent = "Pause";  // Change button text back to "Pause Game"
    }
});

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD"; // Color of the ball
    ctx.fill();
    ctx.closePath();
}

function drawScoreboard() {
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    score1.textContent = scoreRight; 
    score2.textContent = scoreLeft; 
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

function updateBallPosition() {
    ballX += dx;
    ballY += dy;

    if (scoreLeft >= 11 || scoreRight >= 11) {
        displayWinner(); // Display the winner screen
        return; // Stop the game loop
    }

    // Left and right wall collision
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        if (ballY > paddleYRight && ballY < paddleYRight + paddleHeight && dx > 0) {
            dx = -dx;
        } else if (ballY > paddleYLeft && ballY < paddleYLeft + paddleHeight && dx < 0) {
            dx = -dx;
        } else {
            if (dx > 0) {
                scoreLeft++;
                drawScoringEffect("player2"); // Left player scores
            } else {
                scoreRight++;
                drawScoringEffect("player1"); // Right player scores
            }
            // Reset the ball to the center
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            dx = -dx; // Change the ball direction
        }
    }

    // Top and bottom collision
    if (ballY + dy > canvas.height - ballRadius || ballY + dy < ballRadius) {
        dy = -dy;
    }
}
function displayWinner() {
    const winner = scoreLeft >= 11 ? "Player 2" : "Player 1";
    ctx.font = "30px 'Press Start 2P', cursive";
    ctx.fillStyle = "#FFD700"; // Gold color for winner
    ctx.textAlign = "center";
    ctx.fillText(winner + " Wins!", canvas.width / 2, canvas.height / 2);
    pausePlayButton.textContent = "Start Game"; // Change button to allow a new game start
}

function handlePaddleInput() {
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
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddles();
    drawBall();
    updateBallPosition();
    drawScoreboard();
    drawFruits();
    checkFruitCollisions();

    if (!scoreEffectActive) { // Only handle inputs if not showing score effect
        handlePaddleInput();
    }

    score1.textContent = scoreRight;
    score2.textContent = scoreLeft;

    animationFrameId = requestAnimationFrame(draw);
}

// Fruit Settings
const FRUIT_SIZE = 100; // Display size for fruits
let activeFruit = null;

const fruits = [
    { name: "apple", effect: "speedUpBall", duration: 10000 },
    { name: "banana", effect: "shrinkPaddles", duration: 10000 }
];

const fruitImages = {};
fruits.forEach(fruit => {
    let img = new Image();
    img.src = `${fruit.name}.png`; // Ensure the file path is correct
    img.onload = () => fruitImages[fruit.name] = img;
    img.onerror = () => console.error('Failed to load image:', fruit.name);
});

function spawnFruit() {
    if (!activeFruit) {
        let fruitType = fruits[Math.floor(Math.random() * fruits.length)];
        activeFruit = {
            ...fruitType,
            x: Math.random() * (canvas.width - FRUIT_SIZE) + FRUIT_SIZE / 2,
            y: Math.random() * (canvas.height - FRUIT_SIZE) + FRUIT_SIZE / 2
        };
        setTimeout(() => { activeFruit = null; }, 7000); // Remove fruit after 7 seconds
    }
}

function drawFruits() {
    if (activeFruit) {
        let fruit = fruitImages[activeFruit.name];
        if (fruit) {
            ctx.drawImage(fruit, activeFruit.x - FRUIT_SIZE / 2, activeFruit.y - FRUIT_SIZE / 2, FRUIT_SIZE, FRUIT_SIZE);
        }
    }
}

function checkFruitCollisions() {
    if (activeFruit) {
        let fruitRect = {
            left: activeFruit.x - FRUIT_SIZE / 2,
            right: activeFruit.x + FRUIT_SIZE / 2,
            top: activeFruit.y - FRUIT_SIZE / 2,
            bottom: activeFruit.y + FRUIT_SIZE / 2
        };
        let ballRect = {
            left: ballX - ballRadius,
            right: ballX + ballRadius,
            top: ballY - ballRadius,
            bottom: ballY + ballRadius
        };
        if (ballRect.right > fruitRect.left && ballRect.left < fruitRect.right &&
            ballRect.bottom > fruitRect.top && ballRect.top < fruitRect.bottom) {
            applyFruitEffect(activeFruit.effect, activeFruit.duration);
            activeFruit = null;
        }
    }
}

function applyFruitEffect(effect, duration) {
    switch (effect) {
        case "speedUpBall":
            dx *= 1.5;
            dy *= 1.5;
            setTimeout(() => {
                dx /= 1.5;
                dy /= 1.5;
            }, duration);
            break;
        case "shrinkPaddles":
            paddleHeight /= 2;
            setTimeout(() => {
                paddleHeight *= 2;
            }, duration);
            break;
    }
}

setInterval(spawnFruit, 10000); // Spawn fruits every 10 seconds