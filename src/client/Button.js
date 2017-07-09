import React from 'react';

let Button = ({loading, children, className = '', onClick, disabled}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    type="button"
    style={{cursor: disabled ? 'default' : 'pointer'}}
    className={'btn btn-primary ' + className}
  >
    {loading ? (
      <span>
        <span className="fa fa-circle-o-notch fa-spin" />
        &nbsp;
      </span>
    ) : (
      children
    )}
  </button>
);

export default Button;
