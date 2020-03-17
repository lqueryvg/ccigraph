#!/usr/bin/env node

/* istanbul ignore file */

import file from "./file";
import cli from "./cli";
import list from "./list";
import draw from "./draw";

const main = () => {
  const cliArgs = cli.parseCommandLine();
  const workflows = file.getWorkflows(cliArgs);
  if (list.checkAndRun(cliArgs, workflows)) {
    process.exit(0);
  }
  draw.runCommand(cliArgs, workflows);
};

if (require.main !== module) {
  // caller is trying to require / import this module
  throw new Error("ccigraph is not a library");
}

try {
  main();
} catch (e) {
  console.error(e.message);
}
