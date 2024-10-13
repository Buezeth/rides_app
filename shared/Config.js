const gridSize = 1000;
const gridCount = 100;
const squareSize = gridSize / gridCount;
// const fetchInterval = 1000;
const fetchInterval = 1500;
const refreshInterval = 100;
// const circleRefreshInterval = 5000;
const turnDuration = refreshInterval * 8;

export const config = {
  gridSize,
  gridCount,
  squareSize,
  fetchInterval,
  refreshInterval,
  turnDuration,
};

export default config;
// module.exports = config;
// exports.config = config;
