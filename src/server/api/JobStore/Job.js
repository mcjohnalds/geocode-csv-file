import got from 'got';
import delay from 'delay';
import googleAPIKey from './googleAPIKey';

class Job {
  constructor(inputRows) {
    this._finished = false;
    this._result = null;
    // Google places API can't be called more than 50 times per second so we
    // call this._processRow on every inputRow as fast as possible without
    // exceeding 50 calls per second.
    let promises = inputRows.map(async inputRow => {
      let startTime = Date.now();
      let promise = this._processRow(inputRow);
      let timeDiff = Date.now() - startTime;
      if (timeDiff < 1000 / 50) {
        await delay(1000 / 50 - timeDiff);
      }
      return promise;
    });
    // Set some variables when all the promises resolve
    Promise.all(promises).then(outputRows => {
      this._finished = true;
      this._result = outputRows;
    });
  }

  isFinished() {
    return this._finished;
  }

  getResult() {
    return this._result;
  }

  async _processRow(inputRow) {
    let res = await got('https://maps.googleapis.com/maps/api/geocode/json', {
      method: 'GET',
      json: true,
      query: {
        address: inputRow.address,
        key: googleAPIKey
      }
    });
    if (res.body.results.length === 0) {
      console.error(`Failed to process row ${inputRow.address}`);
      return {
        name: inputRow.name,
        address: inputRow.address,
        lat: null,
        lng: null
      };
    } else {
      let {lat, lng} = res.body.results[0].geometry.location;
      return {
        name: inputRow.name,
        address: inputRow.address,
        lat: lat,
        lng: lng
      };
    }
  }
}

export default Job;
