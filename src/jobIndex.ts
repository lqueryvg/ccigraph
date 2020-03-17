import { JobName, RawJob } from "./types";
import Job from "./job";

interface JobIndexRecords {
  [jobName: string]: Job[];
}

export default class JobIndex {
  jobIndex: JobIndexRecords;

  constructor(rawJobList: RawJob[]) {
    this.jobIndex = {};
    this._indexAllRawJobs(rawJobList);

    this._normaliseAllRequiresLists();
    this._renameDuplicates();
  }

  private _indexAllRawJobs(rawJobList: RawJob[]): void {
    for (let i = 0; i < rawJobList.length; i += 1) {
      const rawJob = rawJobList[i];

      const newJob = new Job(rawJob);
      this._addJob(newJob);
    }
  }

  private _normaliseAllRequiresLists(): void {
    // Replaces all strings in all requires lists with jobRefs.
    // If a requires values does not refer to exactly ONE job, raise an error.

    // for all jobs
    const jobNameList = this.getAllJobNames();

    for (let jobi = 0; jobi < jobNameList.length; jobi += 1) {
      const jobName = jobNameList[jobi];

      const job = this.getJob(jobName);

      // eslint-disable-next-line no-continue
      if (!("requires" in job.attrs)) continue;

      const requirementsList = job.attrs.requires as RawJob[];

      for (let i = 0; i < requirementsList.length; i += 1) {
        const requiredJobName = requirementsList[i];

        const jobList: Job[] = this.getJobsWithName(requiredJobName as string);

        if (jobList.length !== 1) {
          throw new Error(
            `Error: Job '${job.name}' requires '${requiredJobName}', which is the name of ${jobList.length} other jobs in workflow`
          );
        }
        [requirementsList[i]] = jobList; // there is only one
      }
    }
  }

  private _renameDuplicates(): void {
    let jobsWereRenamed: boolean;
    do {
      jobsWereRenamed = false;

      const jobNameList = this.getAllJobNames();

      for (let i = 0; i < jobNameList.length; i += 1) {
        const jobName = jobNameList[i];

        const jobList: Job[] = this.getJobsWithName(jobName);
        if (jobList.length > 1) {
          // there are duplicates, add increasing suffix to each job name

          for (let jobCount = 0; jobCount < jobList.length; jobCount += 1) {
            const job = jobList[jobCount];

            const suffix = Number(jobCount) + 1;
            job.name = `${jobName}-${suffix}`;
            this._addJob(job);
          }
          delete this.jobIndex[jobName];

          jobsWereRenamed = true;
        }
      }
    } while (jobsWereRenamed);
  }

  private _addJob(job: Job): void {
    if (job.name in this.jobIndex) {
      this.jobIndex[job.name].push(job);
    } else {
      this.jobIndex[job.name] = [job];
    }
  }

  getJobsWithName(jobName: JobName): Job[] {
    if (jobName in this.jobIndex) {
      return this.jobIndex[jobName];
    }
    return [];
  }

  getJob(jobName: JobName): Job {
    return this.jobIndex[jobName][0];
  }

  getAllJobNames(): JobName[] {
    return Object.keys(this.jobIndex);
  }
}
