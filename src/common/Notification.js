import React from "react";

export default class Notification extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return <div className="alert alert-danger my-3">{this.props.children}</div>;
  }
}
