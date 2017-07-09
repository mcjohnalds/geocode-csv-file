// Button that can be clicked, disabled, or be made to show an animated spinner.
import React from 'react';

let Button = ({
  // Setting loading to true makes the button show an animated spinner
  loading,
  children,
  className = '',
  // onClick is the standard button onClick property
  onClick,
  // Setting disabled to true makes the button look and act unclickable
  disabled
}) => (
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
