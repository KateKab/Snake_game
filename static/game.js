var socket = io();

var direction = "right";

document.addEventListener("keydown", function (e) {
  if (e.keyCode == "39" && direction !== "left") {
    direction = "right"; // Поменяет направление на право
  } // Если нажата стрелочка вниз
  if (e.keyCode == "40" && direction !== "top") {
    direction = "down"; // Поменяет направление вниз
  } // Если нажата стрелочка налево
  if (e.keyCode == "37" && direction !== "right") {
    direction = "left"; // Поменяет направление налево
  } // Если нажата стрелочка верх
  if (e.keyCode == "38" && direction !== "down") {
    direction = "up"; // Поменяет направление верх
  }
});

setInterval(function () {
  socket.emit("direction", direction);
}, 1000 / 60);

const canvas = document.getElementById("canvas");

socket.once("set sizes", function (width, height) {
  canvas.width = width;
  canvas.height = height;
});
const context = canvas.getContext("2d");

socket.on("game over", function () {
  window.location.reload();
});

socket.on("state", function (snake, food, grid) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "green";
  snake.forEach((cell) => {
    context.fillRect(cell.x, cell.y, grid, grid);
  });
  context.fillStyle = "blue";
  context.fillRect(snake[0].x, snake[0].y, grid, grid);
  context.fill();
  context.fillStyle = "red";
  context.fillRect(food.x, food.y, grid, grid);
  context.fill();
});
