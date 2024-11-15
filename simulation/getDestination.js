// import { wait } from "../../shared/utils.js";
import { wait } from "./utils.js";
import {
  generateDestination,
  getClosestRoadNode,
  getGraph,
} from "./methods.js";
const graph = getGraph();
const queue = [];
process.on("message", ({ customerId, location }) => {
  queue.push({ customerId, location });
});
const main = async () => {
  while (true) {
    if (queue.length) {
      const { customerId, location } = queue.shift();
      const [x, y] = location;
      let [destX, destY] = generateDestination(parseInt(x), parseInt(y));
      // let destination = getClosestRoadNode(destX, destY, graph);
      process.send({ customerId, destination: [destX, destY] });
    }
    if (queue.length) continue;
    else await wait(200);
  }
};
main();
