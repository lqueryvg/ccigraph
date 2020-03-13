const minimist = require("minimist");
const dedent = require("dedent");

const DEFAULT_CIRCLECI_FILE = ".circleci/config.yml";

const usageAndExit = () => {
  const basename = path => {
    return path.replace(/.*\//, "");
  };

  const progName = basename(process.argv[1]);
  console.log(
    dedent(`
      Usage:
        ${progName} [-f {filename}] list                      # list all workflow names
        ${progName} [-f {filename}] draw -w {workflow} [-p]   # draw a specific workflow
      Options:
        -f {filename}   the circleci config file, default = ${DEFAULT_CIRCLECI_FILE}
        -w {workflow}   the workflow name to draw
        -p              print the raw graph text instead of creating a link
      Long Names:
        -f        --file
        -w        --workflow
        -p        --print
    `)
  );
  process.exit(1);
};

const parse = () => {
  const validCommands = ["list", "draw"];
  let command;
  const parsedArgs = minimist(process.argv.slice(2), {
    string: ["f", "w"],
    boolean: ["p"],
    alias: { f: "file", w: "workflow", p: "print" },
    default: { f: DEFAULT_CIRCLECI_FILE },
    unknown: word => {
      if (!validCommands.includes(word)) {
        console.error(`ERROR: unknown option '${word}'`);
        usageAndExit();
      }
      if (command) {
        console.error("ERROR: please supply only ONE command");
      }
      command = word;
      return true;
    }
  });

  return parsedArgs;
};

const validate = parsedArgs => {
  // eslint-disable-next-line no-param-reassign
  [parsedArgs.command] = parsedArgs._;

  if (!parsedArgs.command) {
    console.error("ERROR: please supply a command");
    usageAndExit();
  }

  if (parsedArgs.command === "list" && parsedArgs.workflow) {
    console.error("ERROR: -w option is not valid with list command");
    process.exit(1);
  }

  if (parsedArgs.command === "draw" && !parsedArgs.workflow) {
    console.error("ERROR: draw command needs a workflow (-w)");
    process.exit(1);
  }
  return parsedArgs;
};

module.exports.parseCommandLine = () => {
  const parsedArgs = parse();
  validate(parsedArgs);

  // console.log(parsedArgs);
  return parsedArgs;
};
