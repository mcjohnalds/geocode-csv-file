import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Papa from 'papaparse';
import axios from 'axios';
import delay from 'delay';
import download from 'in-browser-download';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';

class App extends React.Component {
  state = {
    // JSON array of {name, address} objects
    inputRows: null,
    // Name of input file
    inputFileName: null,
    // Are we waiting for a response from the server
    waitingForOutput: false,
    // JSON array of {name, address, lat, lng} objects
    outputRows: null
  }

  render = () => (
    <div className="container">
      <h1>Geocode a CSV file</h1>
      <p>
        This tool adds latitude and longitude columns to a CSV that already has
        name and street address columns.
      </p>
      <form
        onSubmit={e => e.preventDefault()}
        className="container"
      >
        <div className="row">
          <label className="col m-2 custom-file">
            <input
              onChange={this.handleFileInputChange}
              type="file"
              className="custom-file-input"
              disabled={this.state.waitingForOutput}
            />
            <span className="custom-file-control" />
          </label>
          {this.state.inputRows ? (
            <button
              onClick={this.handleUploadButtonClick}
              className="col btn btn-primary m-2"
              disabled={this.state.outputRows}
              type="submit"
            >
              {this.state.waitingForOutput ? (
                <span>
                  <span className="fa fa-circle-o-notch fa-spin" />
                  &nbsp;
                </span>
              ) : (
                this.state.outputRows ? 'Uploaded' : 'Upload'
              )}
            </button>
          ) : <div className="col">&nbsp;</div>}
          {this.state.inputRows ? (
            <button
              onClick={this.handleDownloadButtonClick}
              className="col btn btn-primary m-2"
              disabled={!this.state.outputRows}
            >
              Download
            </button>
          ) : <div className="col">&nbsp;</div>}
        </div>
      </form>
      <hr />
      {this.state.inputRows && !this.state.outputRows ? (
        <div>
          <h2>Preview</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Street address</th>
              </tr>
            </thead>
            <tbody>
              {this.state.inputRows.map((inputRow, i) => (
                <tr key={i}>
                  <td>{inputRow.name}</td>
                  <td>{inputRow.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {this.state.outputRows ? (
        <div>
          <h2>Results</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hidden-md-down">Street address</th>
                <th>Latitude</th>
                <th>Longitude</th>
              </tr>
            </thead>
            <tbody>
              {this.state.outputRows.map((outputRow, i) => (
                <tr key={i}>
                  <td>{outputRow.name}</td>
                  <td className="hidden-md-down">{outputRow.address}</td>
                  <td>{outputRow.lat}</td>
                  <td>{outputRow.lng}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )

  handleFileInputChange = event => {
    let file = event.target.files[0];
    if (file) {
      this.setState({inputFileName: file.name});
      Papa.parse(file, {
        complete: ({data, errors}) => {
          let inputRows = data
            .filter(array => array.length === 2)
            .map(([name, address]) => ({name, address}));
          this.setState({
            inputRows,
            waitingForOutput: false,
            outputRows: null
          });
        }
      });
    }
  }

  handleUploadButtonClick = async () => {
    // Upload rows
    if (this.waitingForOutput || this.outputRows) {
      return;
    }
    this.setState({waitingForOutput: true});
    let post = await axios.post('/v1/jobs', {rows: this.state.inputRows});
    // Wait until the server finishes processing
    let jobID = post.data.id;
    let get;
    do {
      get = await axios.get(`/v1/jobs/${jobID}`);
      await delay(3000);
    } while (get.status === 202);
    // Display results
    this.setState({
      outputRows: get.data.rows,
      waitingForOutput: false
    });
  }

  handleDownloadButtonClick = async () => {
    let rows = this.state.outputRows.map(
      ({name, address, lat, lng}) => [name, address, lat, lng]
    );
    let csv = Papa.unparse(rows);
    download(csv, this.getDownloadFileName(), 'text/csv');
  }

  // Make up a nice name for the file we're going to download
  getDownloadFileName = () => {
    if (this.state.inputFileName.endsWith('.csv')) {
      return this.state.inputFileName.slice(0, -4) + '-geocoded.csv';
    } else {
      return this.state.inputFileName + '-geocoded.csv';
    }
  }
}

let div = document.getElementById('root');
ReactDOM.render(<App />, div);
