import { getRoadNodes, wait, getRandomInt, decide } from "./utils.js";
import g from "./global.js";
import config from "./Config.js";

const roadNodes = getRoadNodes();
const { refreshInterval } = config;

export default class Driver {
  constructor({ driverId, name }) {
    this.busy = false;
    this.location = roadNodes[getRandomInt(0, roadNodes.length - 1)];
    this.driverId = driverId;
    this.name = name;
    this.customerId = null;
    this.customerLocation = null;
    this.path = null;
    this.pathIndex = null;

    this.simulate();
  }
  async updateDB() {
    const [x, y] = this.location.split(":");
    const dummyPath =
      this.location && `[[${x}, ${y}], [${parseInt(x) + 1}, ${x}]]`;

    return g.db.query(
      `
        INSERT INTO drivers (driver_id, location, path, path_index, customer_id)
        VALUES (
          '${this.driverId}',
          '${this.location}',
          ${this.path ? `'${JSON.stringify(this.path)}'` : null},
          ${this.pathIndex ? `'${this.pathIndex}'` : null},
          ${this.customerId ? `'${this.customerId}'` : null}
        )
        ON CONFLICT (driver_id)
        DO UPDATE SET
        location = EXCLUDED.location,
        path = EXCLUDED.path,
        path_index = EXCLUDED.path_index,
        customer_id = EXCLUDED.customer_id
        `
    );
  }

  async simulate() {
    g.dispatcher.send({
      from: "driver",
      data: {
        driverId: this.driverId,
        name: this.name,
        location: this.location.split(":"),
      },
    });

    this.updateDB();

    while (true) {
      await wait(refreshInterval);

      if (!this.busy) {
        // Request path if not already requested
        if (this.customerId && this.customerLocation && !this.path) {
          this.busy = true;
          g.routePlanner.send({
            driverId: this.driverId,
            startingPosition: this.location.split(":"),
            destination: this.customerLocation,
          });
        }
      }
    }
  }

  handleDispatcherResult(customerId, customerLocation) {
    this.customerId = customerId;
    this.customerLocation = customerLocation;
    this.updateDB();
  }

  handleRoutePlannerResult(path) {
    this.busy = false;
    this.path = path;
    this.pathIndex = 0;
    this.updateDB();
  }
}
