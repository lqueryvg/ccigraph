/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import dedent from "dedent";
import { RawJob, JobName } from "./types";
import Job from "./job";
import JobIndex from "./jobIndex";

enum CCIColour {
  GREEN = "#42c88a",
  PURPLE = "#d8c4ea"
}

const draw = (workflowName: string, print: boolean, jobs: RawJob[]): void => {
  const jobIndex = new JobIndex(jobs);

  const output: string[] = [];

  const appendOutput = (string: string) => {
    output.push(string);
  };

  appendOutput(` ${workflowName} {`);
  appendOutput(
    // eslint-disable-next-line prefer-template
    "  " +
      dedent(`
        ${workflowName} [
            style="filled"
            fillcolor="${CCIColour.GREEN}"
          ]`)
  );

  const jobNames: JobName[] = jobIndex.getAllJobNames();
  for (const jobCount in jobNames) {
    const job: Job = jobIndex.getJob(jobNames[jobCount]);

    const [thisJobName, jobAttrs] = [job.name, job.attrs];

    const { requires } = jobAttrs; // the list of upstream jobs
    if (requires) {
      for (const requirementCount in requires) {
        const upstreamJob = requires[requirementCount]; // the upstream jobs
        const upstreamJobName = (upstreamJob as Job).name;

        appendOutput(`  "${upstreamJobName}" -> "${thisJobName}";`);
      }
    } else {
      appendOutput(`  ${workflowName} -> "${thisJobName}";`);
    }
    // eslint-disable-next-line dot-notation
    if ("type" in jobAttrs && jobAttrs["type"] === "approval") {
      appendOutput(
        `  "${thisJobName}" [ style="filled" fillcolor="${CCIColour.PURPLE}" ];`
      );
    }
  }
  appendOutput("}");
  const rawOutput = output.join("\n");

  if (print) {
    console.log(`digraph${rawOutput}`);
  } else {
    console.log(
      `https://dreampuf.github.io/GraphvizOnline/#digraph${encodeURIComponent(
        rawOutput
      )}`
    );
  }
};

export default draw;
