/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const dedent = require("dedent");

module.exports.runCommand = (cliArgs, workflows) => {
  const workflowObject = workflows[cliArgs.workflow];
  if (!workflowObject) {
    console.error(`ERROR: can't find workflow '${cliArgs.workflow}' in file`);
    process.exit(1);
  }

  const { jobs } = workflows[cliArgs.workflow];
  // example:
  // jobs = [
  //         {"build":{"filters":{"branches":{"ignore":["master"]}}}},
  //         "lint",
  //         {"test":{"requires":["lint"]}}
  //        ]

  const output = [];

  const appendOutput = string => {
    output.push(string);
  };

  appendOutput(` G {`);
  appendOutput(
    // eslint-disable-next-line prefer-template
    "  " +
      dedent(`
        ${cliArgs.workflow} [
            style="filled"
            fillcolor="#42c88a"
          ]`)
  );

  const jobsFound = [];

  for (const jobIndex in jobs) {
    let job = jobs[jobIndex];

    // normalise the job to be an object with a single attribute whose key is the job name
    // { "job_name": { ... } }
    if (typeof job === "string") {
      const jobName = job;
      job = {};
      job[jobName] = {};
    }

    for (let jobName in job) {
      // there can be only one - Highlander :-)

      const jobContents = job[jobName];

      if ("name" in jobContents) {
        jobName = jobContents.name;
      }

      const jobExists = _jobName => {
        return jobsFound.includes(_jobName);
      };

      const addJobIfNew = _jobName => {
        if (!jobExists(_jobName)) {
          jobsFound.push(_jobName);
        }
      };

      addJobIfNew(jobName);

      const { requires } = jobContents;
      if (requires) {
        for (const requirementIndex in requires) {
          const requirement = requires[requirementIndex];
          if (!jobExists(requirement)) {
            throw new Error(
              `job '${requirement}' does not exist (found in the 'requires' for job '${jobName}')`
            );
          }
          appendOutput(`  ${requirement} -> ${jobName};`);
        }
      } else {
        appendOutput(`  ${cliArgs.workflow} -> ${jobName};`);
      }
    }
  }
  appendOutput("}");
  const rawOutput = output.join("\n");

  if (cliArgs.print) {
    console.log(`digraph${rawOutput}`);
  } else {
    console.log(
      `https://dreampuf.github.io/GraphvizOnline/#digraph${encodeURIComponent(
        rawOutput
      )}`
    );
  }
};
