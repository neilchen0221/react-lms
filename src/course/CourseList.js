import React from "react";
import PageLoader from "../common/PageLoader";
import * as CourseApi from "./CourseApi";

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
      <ul>
        {this.state.courses.map(c => {
          return (
            <li key={c.id}>
              {c.title} - {c.description}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <h1>Course List</h1>
        {this.state.isLoading && <PageLoader />}
        {!this.state.isLoading && this.state.courses.length && this.renderCourses()}
        {!this.state.isLoading && !this.state.courses.length && <h3>No Course...</h3>}
      </div>
    );
  }
}

export default CourseList;
