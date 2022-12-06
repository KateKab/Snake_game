function getRandomCoordinate(min, max, grid) {
  let rand = Math.floor(Math.random() * (max - min) + min);
  return rand - (rand % grid);
}

module.exports = getRandomCoordinate;
