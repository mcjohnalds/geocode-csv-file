import React from 'react';

class FileInput extends React.Component {
  render = () => {
    let {onChange, disabled} = this.props;
    return (
      <div className="input-group">
        <span type="text" className="form-control">
          {this.input && this.input.files.length >= 0 ? (
            this.input.files[0].name
          ) : (
            'Choose file...'
          )}
        </span>
        <span className="input-group-btn">
          <button
            onClick={() => this.input.click()}
            disabled={disabled}
            type="button"
            style={{cursor: disabled ? 'default' : 'pointer'}}
            className="btn btn-secondary"
          >
            Browse
          </button>
        </span>
        <input
          type="file"
          style={{display: 'none'}}
          ref={e => this.input = e}
          onChange={onChange}
        />
      </div>
    );
  };
};

export default FileInput;
