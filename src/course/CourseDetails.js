import React from "react";
import * as CourseApi from "./CourseApi";
import Loader from "../common/Loader";

class CourseDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      course: {
        title: "",
        fee: "",
        description: ""
      }
    };
  }

  async componentDidMount() {
    if (!this.isCreating()) {
      this.setState({ isLoading: true });
      const course = await CourseApi.getCourseById(this.props.match.params.id);
      this.setState({ isLoading: false, course: course });
    }
  }

  handleFieldChange = e => {
    const {
      target,
      target: { name }
    } = e;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      course: {
        ...this.state.course,
        [name]: value
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const { course } = this.state;
    if (this.isCreating()) {
      await CourseApi.createCourse(course);
    } else {
      await CourseApi.updateCourse(course.id, course);
    }
    await CourseApi.createCourse(course);
    alert("saved!");
  };

  isCreating() {
    return this.getCourseId() === "create";
  }
  getCourseId() {
    return this.props.match.params.id;
  }

  renderForm() {
    const {
      course: { title, language, fee, maxStudent, description }
    } = this.state;
    return (
      <div>
        <h1>{this.isCreating() ? "New Course" : "Course Detail"}</h1>

        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Title</label>
            <input name="title" value={title} onChange={this.handleFieldChange} />
          </div>
          <div>
            <label>Language</label>
            <input name="language" value={language} onChange={this.handleFieldChange} />
          </div>
          <div>
            <label>Fee</label>
            <input name="fee" value={fee} onChange={this.handleFieldChange} />
          </div>
          <div>
            <label>Max Students</label>
            <select name="maxStudent" value={maxStudent} onChange={this.handleFieldChange}>
              <option>--Select--</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea name="description" value={description} onChange={this.handleFieldChange} />
          </div>
          <button type="submit">{this.isCreating() ? "Create" : "Save"}</button>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.course && this.renderForm()}
        {!this.state.isLoading && !this.state.course && <h3>Course not found.</h3>}
      </div>
    );
  }
}

export default CourseDetails;
