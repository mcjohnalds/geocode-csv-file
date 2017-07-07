import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

class App extends React.Component {
  render = () => (
    <div className="container">
      <h1>Geocode a CSV file</h1>
      <p>
        This tool adds latitude and longitude columns to a CSV that already has
        name and street address columns
      </p>
    </div>
  )
}

let div = document.getElementById('root');
ReactDOM.render(<App />, div);
