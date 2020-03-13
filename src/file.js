const fs = require("fs");
const YAML = require("yaml");

module.exports.getWorkflows = cliArgs => {
  const file = fs.readFileSync(cliArgs.file, "utf8");

  let cci;
  try {
    cci = YAML.parse(file);
  } catch (e) {
    throw new Error(`error while parsing YAML: ${e.message}`);
  }
  return cci.workflows;
};
