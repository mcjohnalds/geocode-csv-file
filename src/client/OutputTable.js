// Component to display geocoded rows
import React from 'react';
import PropTypes from 'prop-types';

class OutputTable extends React.PureComponent {
  static propTypes = {
    outputRows: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string
    })).isRequired
  }

  render = () => (
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
          {this.props.outputRows.map((outputRow, i) => (
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
  )
}

export default OutputTable;
