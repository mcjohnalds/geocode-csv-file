import React from 'react';

let Button = ({loading, children, className = '', ...props}) => (
  <button
    type="button"
    style={{cursor: props.disabled ? 'default' : 'pointer'}}
    className={'btn btn-primary m-2 ' + className}
    {...props}
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
