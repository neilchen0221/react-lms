import React from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";

export default class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedin: !!localStorage.getItem("access_token")
    };
  }

  componentDidMount() {
    this.setState({
      isLoggedin: !!localStorage.getItem("access_token")
    });
  }

  handleLogout = () => {
    localStorage.removeItem("access_token");
    axios.defaults.headers.common.Authorization = "";
    this.setState({ isLoggedin: false });
  };

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <NavLink className="navbar-brand m-0" to="/">
            <img src={require("../image/lms_brand.png")} height="40spx" alt="lms_brand" />
          </NavLink>

          <div className="navbar-nav ml-sm-5">
            <NavLink className="nav-item nav-link mx-2" to="/dashboard">
              <i className="fa fa-tachometer-alt mr-1" />
              Dashboard
            </NavLink>

            <NavLink className="nav-item nav-link mx-2" to="/courses">
              <i className="fa fa-book mr-2" />
              Course
            </NavLink>

            <NavLink className="nav-item nav-link mx-2" to="/students">
              <i className="fa fa-graduation-cap mr-1" />
              Student
            </NavLink>

            <NavLink className="nav-item nav-link mx-2" to="/lecturers">
              <i className="fas fa-chalkboard-teacher mr-1" />
              Lecturer
            </NavLink>
          </div>

          <ul className="navbar-nav ml-auto">
            {this.state.isLoggedin ? (
              <a href="#" className="nav-item nav-link mx-2" onClick={this.handleLogout}>
                <i className="fas fa-sign-out-alt mr-2" />
                Logout
              </a>
            ) : (
              <Link className="nav-item nav-link mx-2" to="/login">
                <i className="fas fa-sign-in-alt mr-2" />
                Login
              </Link>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
