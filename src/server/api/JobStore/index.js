// Creates new jobs and retrieves exisitng ones.
//
// A job takes an array of objects that each look like
//
//   {name: 'Some place', address: '123 Fake St'}
//
// and geocodes them in the background. Turning them into objects that look
// like
//
//   {name: 'Some place', address: '123 Fake St', lat: 12.345, lng: 6.789}
import uuid from 'uuid/v1';
import Job from './Job';

class JobStore {
  // Create the job store
  constructor() {
    this._jobs = {};
  }

  // Create a new job and return its ID
  createJob(inputRows) {
    let jobID = uuid();
    this._jobs[jobID] = new Job(inputRows);
    return jobID;
  }

  // Does a job exist with the given ID?
  doesJobExist(jobID) {
    return jobID in this._jobs;
  }

  // Has the job with the given ID finished?
  isJobFinished(jobID) {
    return this._jobs[jobID].isFinished();
  }

  // Return the geocoded rows of a finished job
  getJobResult(jobID) {
    return this._jobs[jobID].getResult();
  }
}

export default JobStore;
