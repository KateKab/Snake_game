let getRandomCoordinate = require("./randomizer");

class Snake {
  constructor(width, height, grid, length) {
    this.width = width;
    this.height = height;
    this.grid = grid;
    this.length = length;
  }

  body = [];

  getCoordinates() {
    this.body = [
      {
        x: getRandomCoordinate(0, this.width, this.grid),
        y: getRandomCoordinate(0, this.height, this.grid),
      },
    ];
    for (let i = 1; i < this.length; i++) {
      this.body.push({
        x: this.body[0].x + this.grid * i,
        y: this.body[0].y,
      });
    }
    return this.body;
  }

  moveLeft() {
    this.body.unshift({ x: this.body[0].x - this.grid, y: this.body[0].y });
    this.body.pop();
  }
  moveRight() {
    this.body.unshift({ x: this.body[0].x + this.grid, y: this.body[0].y });
    this.body.pop();
  }
  moveUp() {
    this.body.unshift({ x: this.body[0].x, y: this.body[0].y - this.grid });
    this.body.pop();
  }
  moveDown() {
    this.body.unshift({ x: this.body[0].x, y: this.body[0].y + this.grid });
    this.body.pop();
  }

  loopBorders() {
    if (this.body[0].x < 0) {
      this.body[0].x = this.width - this.grid;
    } else if (this.body[0].x >= this.width) {
      this.body[0].x = 0;
    }

    if (this.body[0].y < 0) {
      this.body[0].y = this.height - this.grid;
    } else if (this.body[0].y >= this.height) {
      this.body[0].y = 0;
    }
  }

  eat(eater, victim) {
   this.body.push({ x: this.body.at(-1).x + this.grid, y: this.body.at(-1).y });
  }

}

module.exports = Snake;
