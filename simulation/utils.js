import { obstacles } from "../shared/Obstacles.js";
import { config } from "../shared/Config.js";

const { gridCount } = config;
export const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

export const decide = (probability) => getRandomInt(1, 100) < probability;

export const wait = (t) =>
  new Promise((res) => {
    setTimeout(() => {
      res();
    }, t);
  });

export const getRoadNodes = () => {
  const coordsToObstacles = {};
  obstacles.forEach(([xStart, xEnd, yStart, yEnd]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        coordsToObstacles[`${x}:${y}`] = true;
        y += 1;
      }
      x += 1;
    }
  });

  const roadNodes = [];
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      if (!coordsToObstacles[`${x}:${y}`]) {
        roadNodes.push(`${x}:${y}`);
      }
    }
  }

  return roadNodes;
};
