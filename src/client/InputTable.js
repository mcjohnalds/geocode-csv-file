// Component to display user input rows
import React from 'react';
import PropTypes from 'prop-types';

class InputTable extends React.PureComponent {
  static propTypes = {
    inputRows: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string
    })).isRequired
  }

  render = () => (
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
          {this.props.inputRows.map((inputRow, i) => (
            <tr key={i}>
              <td>{inputRow.name}</td>
              <td>{inputRow.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default InputTable;
