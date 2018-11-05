import React from "react";
import Loader from "../common/Loader";
import * as CourseApi from "./CourseApi";
import { Link } from "react-router-dom";

class CourseList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      courses: []
    };
  }

  async componentDidMount() {
    const courses = await CourseApi.getCourses();
    this.setState({ isLoading: false, courses: courses || [] });
  }

  renderCourses() {
    return (
      <div className="row">
        {this.state.courses.map(c => {
          return (
            <div key={c.id} className="col-sm-4" style={{ padding: "1rem" }}>
              <div className="card">
                <div className="card-header">{c.title}</div>
                <div className="card-body">
                  <p className="card-text">{c.description}</p>
                  <Link className="btn btn-primary" to={`/courses/${c.id}`}>
                    Detail
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="container-fluid">
        <h1>Course List</h1>
        <Link className="btn btn-primary" to={`/courses/create`}>
          New Couse
        </Link>
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.courses.length && this.renderCourses()}
        {!this.state.isLoading && !this.state.courses.length && <h3>No Course...</h3>}
      </div>
    );
  }
}

export default CourseList;
