import React from 'react';
import logo from './logo.svg';

let Title = () => (
  <div>
    <div className="hidden-md-up">
      <div className="container">
        <div className="row justify-content-center">
          <img
            src={logo}
            style={{height: '3.5rem', margin: '1rem 1rem'}}
          />
          <h1>Geocode a CSV file</h1>
        </div>
      </div>
    </div>
    <div className="hidden-sm-down">
      <h1>
        <img
          src={logo}
          style={{height: '3.5rem', margin: '1rem 1rem'}}
        />
        Geocode a CSV file
      </h1>
    </div>
  </div>
);

export default Title;
