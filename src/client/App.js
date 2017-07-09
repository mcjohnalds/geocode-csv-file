import React from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import delay from 'delay';
import download from 'in-browser-download';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import Title from './Title';
import FileInput from './FileInput';
import Button from './Button';
import InputTable from './InputTable';
import OutputTable from './OutputTable';

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
      <Title />
      <p>
        This tool adds latitude and longitude columns to a CSV that already has
        name and street address columns.
      </p>
      <div className="container">
        <div className="row">
          <div className="col-12 mb-2 col-md-6 mb-md-0">
            <FileInput
              onChange={this.handleFileInputChange}
              disabled={this.state.waitingForOutput}
            />
          </div>
          <div className="col">
            {this.state.inputRows ? (
              <Button
                onClick={this.handleUploadButtonClick}
                disabled={this.state.outputRows}
                loading={this.state.waitingForOutput}
                className="w-100"
              >
                {this.state.outputRows ? 'Uploaded' : 'Upload'}
              </Button>
            ) : ' '}
          </div>
          <div className="col">
            {this.state.inputRows ? (
              <Button
                onClick={this.handleDownloadButtonClick}
                disabled={!this.state.outputRows}
                className="w-100"
              >
                Download
              </Button>
            ) : ' '}
          </div>
        </div>
      </div>
      <hr />
      {this.state.inputRows && !this.state.outputRows ? (
        <InputTable inputRows={this.state.inputRows} />
      ) : null}
      {this.state.outputRows ? (
        <OutputTable outputRows={this.state.outputRows} />
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
      await delay(1000);
      get = await axios.get(`/v1/jobs/${jobID}`);
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

export default App;
