// зависимости
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

function getRandomCoordinate(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

//обработчик веб-сокетов
let snake = [{ x: width / 2, y: height / 2 }];
// let snake = [{x:100, y:100}, {x:110, y:100}, {x:120, y:100}, {x:130, y:100}];

let food = {
  x: getRandomCoordinate(0, width),
  y: getRandomCoordinate(0, height),
};

for (let i = 1; i < 50; i++) {
  snake.push({ x: snake[0].x + grid * i, y: snake[0].y });
}

function MacroCollision(obj1, obj2) {
  var XColl = false;
  var YColl = false;

  if (obj1.x + grid >= obj2.x && obj1.x <= obj2.x + grid) XColl = true;
  if (obj1.y + grid >= obj2.y && obj1.y <= obj2.y + grid) YColl = true;

  if (XColl & YColl) {
    return true;
  }
  return false;
}

io.on("connection", function (socket) {
  socket.emit("set sizes", width, height);
  socket.on("direction", function (direction) {
    if (direction == "right") {
      snake.unshift({ x: snake[0].x + 3, y: snake[0].y });
    } else if (direction == "down") {
      snake.unshift({ x: snake[0].x, y: (snake[0].y += 3) });
    } else if (direction == "left") {
      snake.unshift({ x: (snake[0].x -= 3), y: snake[0].y });
    } else if (direction == "up") {
      snake.unshift({ x: snake[0].x, y: (snake[0].y -= 3) });
    }
    snake.pop();
  });
});

setInterval(function () {
  if (snake[0].x < 0) {
    snake[0].x = width - grid;
  } else if (snake[0].x >= width) {
    snake[0].x = 0;
  }

  if (snake[0].y < 0) {
    snake[0].y = height - grid;
  } else if (snake[0].y >= height) {
    snake[0].y = 0;
  }

  for (let i = 2; i < snake.length; i++) {
    if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
      io.sockets.emit("game over");
    }
  }

  if (MacroCollision(snake[0], food)) {
    snake.push({ x: snake.at(-1).x + grid, y: snake.at(-1).y });
    food.x = getRandomCoordinate(0, width);
    food.y = getRandomCoordinate(0, height);
  }
}, 1000 / 10);

setInterval(function () {
  io.sockets.emit("state", snake, food, grid);
  // snake.x += grid;
}, 1000 / 120);
