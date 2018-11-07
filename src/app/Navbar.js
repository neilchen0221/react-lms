import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
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
    </nav>
  );
}
