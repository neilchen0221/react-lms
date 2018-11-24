import React from "react";
import ReactDOM from "react-dom";

const dialog = document.getElementById("modaldialog");

class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }
  componentDidMount() {
    dialog.appendChild(this.el);
  }
  componentWillUnmount() {
    dialog.removeChild(this.el);
  }
  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

export default Portal;
