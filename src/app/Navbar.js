import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
      <NavLink className="navbar-brand" to="/">
        LMS
      </NavLink>
      <div className="navbar-nav">
        <NavLink className="nav-item nav-link" to="/">
          Dashboard
        </NavLink>

        <NavLink className="nav-item nav-link" to="/courses">
          Course
        </NavLink>

        <NavLink className="nav-item nav-link" to="/students">
          Student
        </NavLink>
      </div>
    </nav>
  );
}
