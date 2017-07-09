// Button that can be clicked, disabled, or be made to show an animated spinner.
import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.PureComponent {
  static propTypes = {
    // Setting loading to truthy makes the button show an animated spinner
    loading: PropTypes.any,
    // onClick is the standard button onClick property
    onClick: PropTypes.func,
    // Setting disabled to truthy makes the button look and act unclickable
    disabled: PropTypes.any
  }

  static defaultProps = {
    className: ''
  }

  render = () => (
    <button
      onClick={this.props.onClick}
      disabled={this.props.disabled}
      type="button"
      style={{cursor: this.props.disabled ? 'default' : 'pointer'}}
      className={'btn btn-primary ' + this.props.className}
    >
      {this.props.loading ? (
        <span>
          <span className="fa fa-circle-o-notch fa-spin" />
          &nbsp;
        </span>
      ) : (
        this.props.children
      )}
    </button>
  );
}

export default Button;
