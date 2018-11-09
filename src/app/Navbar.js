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

  handleLogout = () => {
    localStorage.removeItem("access_token");
    axios.defaults.headers.common.Authorization = "";
    this.setState({ isLoggedin: false });
  };

  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <NavLink className="navbar-brand" to="/">
          LMS
        </NavLink>

        <div className="navbar-nav ml-5">
          <NavLink className="nav-item nav-link mx-2" to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink className="nav-item nav-link mx-2" to="/courses">
            Course
          </NavLink>

          <NavLink className="nav-item nav-link mx-2" to="/students">
            Student
          </NavLink>

          <NavLink className="nav-item nav-link mx-2" to="/lecturers">
            Lecturer
          </NavLink>
        </div>

        <ul className="navbar-nav ml-auto">
          {this.state.isLoggedin ? (
            <a href="#" className="nav-item nav-link mx-2" onClick={this.handleLogout}>
              <i className="fa fa-sign-out mr-2" />
              Logout
            </a>
          ) : (
            <Link className="nav-item nav-link mx-2" to="/login">
              <i className="fa fa-sign-in mr-2" />
              Login
            </Link>
          )}
        </ul>
      </nav>
    );
  }
}
