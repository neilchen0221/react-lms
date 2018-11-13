import React from "react";
import Loader from "../common/Loader";
import * as CourseApi from "./CourseApi";
import { Link } from "react-router-dom";
import Notification from "../common/Notification";

class CourseList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: "",
      courses: []
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const courses = await CourseApi.getCourses();
      this.setState({ isLoading: false, courses: courses || [] });
    } catch (e) {
      this.setState({ isLoading: false, error: "Something went wrong while loading courses..." });
    }
  }

  renderCourses() {
    return (
      <div className="row">
        {!this.state.courses.length && <h3>No Course...</h3>}
        {this.state.courses.map(c => {
          return (
            <div key={c.id} className="col-sm-4" style={{ padding: "1rem" }}>
              <div className="card lms-shadow">
                <div className="card-header">
                  <h5>{c.title}</h5>
                </div>
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
      <div className="lms-list__container">
        <h1>
          <i className="fas fa-swatchbook mx-3" />
          Course List
        </h1>
        <Link className="btn btn-primary my-3" to={`/courses/create`}>
          New Course
        </Link>
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && !this.state.error && this.renderCourses()}
      </div>
    );
  }
}

export default CourseList;
