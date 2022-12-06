const socket = io();

let direction = "left";

document.addEventListener("keydown", function (e) {
  if (e.keyCode == "39" && direction !== "left") {
    direction = "right";
    // Поменяет направление на право
  } // Если нажата стрелочка вниз
  if (e.keyCode == "40" && direction !== "up") {
    direction = "down";
  } // Если нажата стрелочка налево
  if (e.keyCode == "37" && direction !== "right") {
    direction = "left";
  } // Если нажата стрелочка верх
  if (e.keyCode == "38" && direction !== "down") {
    direction = "up";
  }
  if (e.keyCode == "32") {
    if (!direction.includes("!")) {
      direction += "!";
    } else direction = direction.replace('!', '');
  }
});

setInterval(function () {
  socket.emit("direction", direction);
}, 1000 / 5); // speed

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
  snake.body.forEach((cell) => {
    context.fillRect(cell.x, cell.y, grid, grid);
  });
  context.fillStyle = "red";
  context.fillRect(food.foodCoordinates.x, food.foodCoordinates.y, grid, grid);
  context.fill();
});
