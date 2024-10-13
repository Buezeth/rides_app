// import { wait } from "../../shared/utils.js";
import { wait } from "./utils.js";
import {
  generateDestination,
  getClosestRoadNode,
  getGraph,
} from "./methods.js";
const graph = getGraph();
const queue = [];
process.on("message", ({ name, location }) => {
  queue.push({ name, location });
});
const main = async () => {
  while (true) {
    if (queue.length) {
      const { name, location } = queue.shift();
      const [x, y] = location;
      let [destX, destY] = generateDestination([x, y]);
      let destination = getClosestRoadNode(destX, destY, graph);
      process.send({ name, destination });
    }
    if (queue.length) continue;
    else await wait(200);
  }
};
main();
//# sourceMappingURL=getDestination.js.map
