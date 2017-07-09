// Component to display geocoded rows
import React from 'react';

let OutputTable = ({outputRows}) => (
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
        {outputRows.map((outputRow, i) => (
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
);

export default OutputTable;
