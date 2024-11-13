import dbInit from "./dbInit.js";
import { fork } from "child_process";

const g = {
  db: await dbInit(),
  getDestination: fork("getDestination.js"),
  dispatcher: fork("dispatcher.js"),
  activeCustomers: new Map(),
  routePlanner: fork("routePlanner.js"),
};

const init = async () => {
  g.db = await dbInit();
  g.getDestination = fork("getDestination.js");
  g.dispatcher = fork("dispatcher.js");
  g.activeCustomers = new Map();
  g.routePlanner = fork("routePlanner.js");
};

export default g;
