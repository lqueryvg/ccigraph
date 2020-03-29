#!/usr/bin/env node

/* istanbul ignore file */
import fs from "fs";
import YAML from "yaml";
import { ParsedArgs } from "minimist";
// import getWorkflowFromFile from "./getWorkflowsFromFile";
import parseCommandLine from "./parseCommandLine";
import draw from "./draw";

if (require.main !== module) {
  // caller is trying to require / import this module
  throw new Error("ccigraph is not a library");
}

const getWorkflowsFromFile = (filename: string) => {
  const fileData = fs.readFileSync(filename, "utf8");

  let circleciConfig;
  try {
    circleciConfig = YAML.parse(fileData);
  } catch (e) {
    throw new Error(`error while parsing YAML: ${e.message}`);
  }
  return circleciConfig.workflows;
};

const main = () => {
  const parsedArgs: ParsedArgs = parseCommandLine();
  const workflows = getWorkflowsFromFile(parsedArgs.file);

  if (parsedArgs.command === "list") {
    console.log(Object.keys(workflows).join("\n"));
    process.exit(0);
  }

  // must be draw command

  const workflowObject = workflows[parsedArgs.workflow];
  if (!workflowObject) {
    console.error(
      `ERROR: can't find workflow '${parsedArgs.workflow}' in file`
    );
    process.exit(1);
  }

  const { jobs } = workflowObject;

  draw(parsedArgs.workflow, parsedArgs.print, jobs);
};

try {
  main();
} catch (e) {
  console.error(e.message);
}
