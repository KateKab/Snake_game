// зависимости
let Snake = require("./snake");
let Food = require("./food");

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const port = 5000;
const grid = 10;
const width = 800;
const height = 600;
let length = 5;

app.set("port", port); // присваивает значение настройке 'port'
app.use("/static", express.static(`${__dirname}/static`)); // промежуточная функция выполняется при совпадении запрашиваемого адреса с первым аргументом.
// express.static('имя директории') для передачи с сервера статических файлов, находящихся в 'имя директории'

// маршруты
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// запуск сервера
server.listen(port, function () {
  console.log(`Запущен сервер на порте ${port}`);
});

let snake = new Snake(width, height, grid, length);
snake.getCoordinates();

let food = new Food(width, height, grid);
food.getCoordinates();

io.on("connection", function (socket) {
  socket.emit("set sizes", width, height);
  socket.on("direction", function (direction) {
    if (direction == "right") {
      snake.moveRight();
    }
    if (direction == "down") {
      snake.moveDown();
    }
    if (direction == "left") {
      snake.moveLeft();
    }
    if (direction == "up") {
      snake.moveUp();
    }
    // if (direction == "none") {
    // }
  });
});

setInterval(function () {
  snake.loopBorders();

  if (
    snake.body[0].x === food.foodCoordinates.x &&
    snake.body[0].y === food.foodCoordinates.y
  ) {
    snake.eat();
    food.getCoordinates();
  }

  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.body[0].x === snake.body[i].x &&
      snake.body[0].y === snake.body[i].y
    ) {
      io.sockets.emit("game over");
      length = 2;
      snake = new Snake(width, height, grid, length);
      snake.getCoordinates();
    }
  }
}, 1000 / 10);

setInterval(function () {
  io.sockets.emit("state", snake, food, grid);
}, 1000 / 60);
