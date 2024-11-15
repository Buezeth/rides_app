import obstacles from "./Obstacles.js";
// import { getRandomInt } from "../../shared/utils.mjs";

import { getRandomInt } from "./utils.js";
// import config from "../shared/Config.js";
import config from "./Config.js";
const { gridCount } = config;

export const getObstaclesSet = (obstacles) => {
  const obstaclesSet = new Set();
  obstacles.forEach(([xStart, xEnd, yStart, yEnd]) => {
    let x = xStart;
    while (x <= xEnd) {
      let y = yStart;
      while (y <= yEnd) {
        obstaclesSet.add(`${x}:${y}`);
        y += 1;
      }
      x += 1;
    }
  });
  return obstaclesSet;
};

export const getRoadNodes = () => {
  const obstaclesSet = getObstaclesSet(obstacles);
  const roadNodes = [];
  for (let x = 0; x < gridCount; x++) {
    for (let y = 0; y < gridCount; y++) {
      if (!obstaclesSet.has(`${x}:${y}`)) {
        roadNodes.push([x, y]);
      }
    }
  }
  return roadNodes;
};

export const buildGraph = (obstaclesSet, gridCount) => {
  const graph = [];
  for (let y = 0; y < gridCount; y++) {
    graph[y] = [];
    for (let x = 0; x < gridCount; x++) {
      if (obstaclesSet.has(`${x}:${y}`)) graph[y][x] = 0;
      else graph[y][x] = 1;
    }
  }

  return graph;
};

export const getGraph = () => {
  const obstaclesSet = getObstaclesSet(obstacles);
  return buildGraph(obstaclesSet, gridCount);
};

export const getDestinationRange = (coord) =>
  coord < gridCount / 2
    ? [gridCount / 2 + Math.floor(coord / 2), gridCount]
    : [0, gridCount / 2 - Math.floor((gridCount - coord) / 2)];

export const getClosestRoadNode = (x, y, graph = getGraph()) => {
  if (graph[y][x] === 1) return [x, y];

  const isValid = (y, x) =>
    y > 0 && y < graph.length - 1 && x > 0 && x < graph[y].length - 1;
  const directions = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  let queue = [[y, x]];
  const seen = new Set([`${y}:${x}`]);
  while (queue.length) {
    const nextQueue = [];
    for (let i = 0; i < queue.length; i++) {
      const [y, x] = queue[i];
      for (const [dx, dy] of directions) {
        const nextY = y + dy;
        const nextX = x + dx;
        if (isValid(nextY, nextX) && !seen.has(`${nextY}:${nextX}`)) {
          if (graph[nextY][nextX] === 1) return [nextX, nextY];
          seen.add(`${nextY}:${nextX}`);
          nextQueue.push([nextY, nextX]);
        }
      }
    }
    queue = nextQueue;
  }
};

export const generateDestination = (coordPairX, coordPairY) => {
  // const [startX, startY] = coordPair;
  const rangeX = getDestinationRange(coordPairX);
  const rangeY = getDestinationRange(coordPairY);

  // const generatedDestination = [
  //   getRandomInt(rangeX[0], rangeX[1]),
  //   getRandomInt(rangeY[0], rangeY[1]),
  // ];

  const destX = getRandomInt(rangeX[0], rangeX[1]);
  const destY = getRandomInt(rangeY[0], rangeY[1]);

  // return generatedDestination;
  let destination = getClosestRoadNode(destX, destY);

  return destination;
};

// const getDistance = (coordsA, coordsB) => {
//   const [xA, yA] = coordsA;
//   const [xB, yB] = coordsB;
//   return Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2);
// };

export const getStraightLineDistance = (coordsA, coordsB) => {
  const [xA, yA] = coordsA;
  const [xB, yB] = coordsB;
  return Math.sqrt(
    Math.pow(parseInt(xB) - parseInt(xA), 2) +
      Math.pow(parseInt(yB) - parseInt(yA), 2)
  );
};

export const getShortestPath = (
  startingPosition,
  destination,
  graph = getGraph()
) => {
  const isValid = (y, x) => {
    // console.log(graph[y]);
    return (
      y >= 0 &&
      y < graph.length &&
      x >= 0 &&
      x < graph[y].length &&
      graph[y][x] === 1
    );
  };

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  const [col, row] = startingPosition;
  const intStart = [parseInt(col), parseInt(row)];
  let queue = [[parseInt(row), parseInt(col), [intStart]]];
  const seen = new Set([`${row}:${col}`]);

  while (queue.length) {
    const nextQueue = [];
    for (let i = 0; i < queue.length; i++) {
      const [row, col, currPath] = queue[i];
      // console.log(destination);
      if (
        row === parseInt(destination[1]) &&
        col === parseInt(destination[0])
      ) {
        console.log("Got path");
        return currPath;
      }

      for (let j = 0; j < directions.length; j++) {
        const [dx, dy] = directions[j];

        const nextRow = parseInt(row) + parseInt(dy);
        const nextCol = parseInt(col) + parseInt(dx);

        // console.log(
        //   "Row: " + nextRow + " Col: " + nextCol + " CurrentPath: " + currPath
        // );

        if (isValid(nextRow, nextCol) && !seen.has(`${nextRow}:${nextCol}`)) {
          seen.add(`${nextRow}:${nextCol}`);
          nextQueue.push([nextRow, nextCol, [...currPath, [nextCol, nextRow]]]);
        }
      }
    }
    queue = nextQueue;
  }
};
