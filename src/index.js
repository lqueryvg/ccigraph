#!/usr/bin/env node

const file = require("./file");
const cli = require("./cli");
const list = require("./list");
const draw = require("./draw");

const main = () => {
  const cliArgs = cli.parseCommandLine();
  const workflows = file.getWorkflows(cliArgs);
  if (list.checkAndRun(cliArgs, workflows)) {
    process.exit(0);
  }
  draw.runCommand(cliArgs, workflows);
};

try {
  main();
} catch (e) {
  console.error(e.message);
}
