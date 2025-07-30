// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

canvas.width = window.innerWidth-50;
canvas.height = window.innerHeight - 200;

const box = 20;
let snake, direction, food, score, gameInterval;
let isGameRunning = false;
let intervalTime = 150;

let highScore = localStorage.getItem("snakeHighScore") || 0;

function initGame() {
  snake = [{ x: box * 5, y: box * 5 }];
  direction = { x: box, y: 0 };
  score = 0;
  intervalTime = 150;
  isGameRunning = true;
  food = generateFood();
  scoreEl.textContent = `Score: ${score} | High Score: ${highScore}`;
  clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, intervalTime);
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

function updateGame() {
  if (!isGameRunning) return;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("snakeHighScore", highScore);
    }
    scoreEl.textContent = `Score: ${score} | High Score: ${highScore}`;
    food = generateFood();

    // Increase speed
    intervalTime = Math.max(50, 150 - snake.length * 2);
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, intervalTime);
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2 - 2, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();

  // 🐍 Draw Snake
for (let i = 0; i < snake.length; i++) {
  ctx.fillStyle = i === 0 ? "black" : "lime";
  ctx.fillRect(snake[i].x, snake[i].y, box, box);
  ctx.strokeStyle = "#111";
  ctx.strokeRect(snake[i].x, snake[i].y, box, box);
}

}

function gameOver() {
  isGameRunning = false;
  clearInterval(gameInterval);
  ctx.fillStyle = "white";
  ctx.font = "26px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
  ctx.font = "18px Arial";
  ctx.fillText("Press 'Restart' to play again", canvas.width / 2 - 130, canvas.height / 2 + 30);
}

document.addEventListener("keydown", e => {
  if (!isGameRunning) return;

  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -box };
  else if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: box };
  else if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -box, y: 0 };
  else if (e.key === "ArrowRight" && direction.x === 0) direction = { x: box, y: 0 };
});

restartBtn.addEventListener("click", () => {
  initGame();
});

// Start
initGame();
