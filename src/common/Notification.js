import React from "react";
import classnames from "classnames";

export default class Notification extends React.PureComponent {
  constructor() {
    super();
    this.state = { shown: true };
  }

  handleClose = () => {
    this.setState({ shown: false });
  };

  render() {
    if (!this.state.shown) {
      return null;
    }

    const { type, children } = this.props;
    return (
      <div className={classnames("alert", "my-3", `alert-${type || "danger"}`)}>
        {children}
        <button onClick={this.handleClose} className="close float-right">
          <span>&times;</span>
        </button>
      </div>
    );
  }
}
