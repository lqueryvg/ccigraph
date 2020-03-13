module.exports.checkAndRun = (cliArgs, workflows) => {
  if (cliArgs.command === "list") {
    console.log(Object.keys(workflows).join("\n"));
    return true;
  }
  return false;
};
