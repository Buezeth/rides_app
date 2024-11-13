import config from "./Config.js";
import { drivers, customers } from "./data.js";
import Driver from "./Driver.js";
import Customer from "./Customer.js";
import g from "./global.js";

const { db, getDestination, dispatcher, routePlanner } = g;

import { fork } from "child_process";

const main = async () => {
  await db.query("DELETE FROM drivers;");
  await db.query("DELETE FROM customers;");

  // Simulate drivers
  const driverInstances = {};

  drivers.forEach(({ driverId, name }) => {
    driverInstances[driverId] = new Driver({ driverId, name });
  });

  // Simulate customers
  const customerInstances = {};

  customers.forEach(({ customerId, name }) => {
    customerInstances[customerId] = new Customer({ customerId, name });
  });

  // console.log(customerInstances);

  getDestination.on("message", ({ customerId, destination }) => {
    customerInstances[customerId].handleDestinationResult(destination);
  });

  dispatcher.on("message", ({ customerId, driverId, location }) => {
    customerInstances[customerId].handleDispatcherResult(driverId);
    driverInstances[driverId].handleDispatcherResult(customerId, location);
  });

  routePlanner.on("message", ({ driverId, path }) => {
    driverInstances[driverId].handleRoutePlannerResult(path);
  });
};

main();
