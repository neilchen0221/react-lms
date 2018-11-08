import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="lms-list__container mt-5 p-5">
      <h1 className="text-center mb-5">Welcome to LMS</h1>

      <div className="row justify-content-around">
        <div className="col-sm-5">
          <div className="card text-white bg-info mb-5">
            <div className="card-header">
              <h3>Course</h3>
            </div>
            <div className="card-body">
              <h5 className="card-title mb-5">All kinds of courses needed for IT industry</h5>
              <Link className="btn btn-outline-light mr-3" to={`/courses`}>
                Course List
              </Link>
              <Link className="btn btn-outline-light" to={`/courses/create`}>
                New Course
              </Link>
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <div className="card text-white bg-success mb-5">
            <div className="card-header">
              <h3>Lecturers</h3>
            </div>
            <div className="card-body">
              <h5 className="card-title mb-5">Best lecturers in IT world</h5>
              <Link className="btn btn-outline-light mr-3" to={`/lecturers`}>
                Lecturer List
              </Link>
              <Link className="btn btn-outline-light" to={`/lecturers/create`}>
                New Lecturer
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-around">
        <div className="col-sm-5">
          <div className="card text-dark bg-warning mb-5">
            <div className="card-header">
              <h3>Student</h3>
            </div>
            <div className="card-body">
              <h5 className="card-title mb-5">Hard-working and smart students</h5>
              <Link className="btn btn-outline-dark mr-3" to={`/students`}>
                Student List
              </Link>
              <Link className="btn btn-outline-dark" to={`/students/create`}>
                New Student
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
