let getRandomCoordinate = require("./randomizer");

class Food {
  constructor(width, height, grid) {
    this.width = width;
    this.height = height;
    this.grid = grid;
  }

  foodCoordinates = {};

  getCoordinates() {
    this.foodCoordinates = {
      x: getRandomCoordinate(0, this.width, this.grid),
      y: getRandomCoordinate(0, this.height, this.grid),
    };
    return this.foodCoordinates;
  }
}

module.exports = Food;
