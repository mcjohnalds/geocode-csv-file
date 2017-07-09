// Component to display user input rows
import React from 'react';

let InputTable = ({inputRows}) => (
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
        {inputRows.map((inputRow, i) => (
          <tr key={i}>
            <td>{inputRow.name}</td>
            <td>{inputRow.address}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InputTable;
