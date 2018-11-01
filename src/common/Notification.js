import React from "react";

export default class Notification extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return <h3>{this.props.children}</h3>;
  }
}
