import uuid from 'uuid/v1';
import Job from './Job';

class JobStore {
  constructor() {
    this._jobs = {};
  }

  createJob(inputRows) {
    let jobID = uuid();
    this._jobs[jobID] = new Job(inputRows);
    return jobID;
  }

  doesJobExist(jobID) {
    return jobID in this._jobs;
  }

  isJobFinished(jobID) {
    return this._jobs[jobID].isFinished();
  }

  getJobResult(jobID) {
    return this._jobs[jobID].getResult();
  }
}

export default JobStore;
