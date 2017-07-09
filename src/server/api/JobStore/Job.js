import got from 'got';
import googleAPIKey from './googleAPIKey';
import throttle from 'throttle-debounce/throttle';

class Job {
  constructor(inputRows) {
    this._finished = false;
    this._result = null;
    // Delay results when necessary so processRow is called less than 50 times
    // per second in order to not go over Google's API limit
    this._processRowThrottled = throttle(1000 / 50, this._processRow)
    // Run this._processRow on every inputRow in parallel
    let promises = inputRows.map(
      inputRow => this._processRow(inputRow)
    );
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
