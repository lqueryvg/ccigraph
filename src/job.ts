/* eslint-disable lines-between-class-members */
/* eslint-disable import/no-cycle */
/* eslint-disable no-dupe-class-members */
import { JobName, RawJob } from "./types";

interface JobAttributes {
  name?: string;
  requires?: (string | Job)[];
}

export default class Job {
  attrs: JobAttributes;
  name: JobName;

  constructor(jobName: JobName);
  constructor(rawJob: RawJob);
  constructor(jobNameOrRawJob: JobName | RawJob) {
    if (typeof jobNameOrRawJob === "string") {
      this.name = jobNameOrRawJob;
      this.attrs = {};
    } else {
      const rawJob = jobNameOrRawJob;
      [this.name] = Object.keys(rawJob); // there should be only one
      this.attrs = rawJob[this.name];

      // if job has a name attribute, use it
      if ("name" in this.attrs) {
        this.name = this.attrs.name as string;
      }
    }
  }
}
