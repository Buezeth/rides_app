const gridSize = 500;
const gridCount = 50;
const squareSize = gridSize / gridCount;
// const fetchInterval = 1000;
const fetchInterval = 5000;
const refreshInterval = 100;
const turnDuration = refreshInterval * 8;

const config = {
  gridSize,
  gridCount,
  squareSize,
  fetchInterval,
  refreshInterval,
  turnDuration,
};

export default config;
