import { wait } from "./utils.js";
import { getShortestPath } from "./methods.js";

const queue = [];

process.on("message", ({ driverId, startingPosition, destination }) => {
  queue.push({ driverId, startingPosition, destination });
});

const main = async () => {
  while (true) {
    if (queue.length) {
      const { driverId, startingPosition, destination } = queue.shift();
      let path = getShortestPath(startingPosition, destination);
      // console.log(destination);

      process.send({ driverId, path });
    }

    if (queue.length) continue;
    else await wait(200);
  }
};
main();
