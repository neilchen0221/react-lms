import React from "react";
import * as CourseApi from "./CourseApi";
import Loader from "../common/Loader";
import * as yup from "yup";
import { pick } from "lodash/object";
import { getValidationErrors } from "../common/Helper";
import Notification from "../common/Notification";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  title: yup
    .string()
    .max(50)
    .label("Title")
    .required(),
  language: yup
    .string()
    .max(50)
    .label("Language")
    .required(),
  fee: yup
    .number()
    .positive()
    .min(10)
    .max(5000)
    .label("Fee")
    .required(),
  maxStudent: yup
    .number()
    .positive()
    .min(10)
    .max(40)
    .label("Max students")
    .required(),
  description: yup
    .string()
    .max(250)
    .label("Description")
});

class CourseDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      course: {
        title: "",
        fee: "",
        description: ""
      },
      validationErrors: {},
      error: ""
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

    const userInput = pick(this.state.course, ["title", "language", "fee", "maxStudent", "description"]);
    try {
      await schema.validate(userInput, {
        abortEarly: false
      });
    } catch (err) {
      const validationErrors = getValidationErrors(err);
      this.setState({ validationErrors });
      return;
    }

    const { course } = this.state;
    if (this.isCreating()) {
      try {
        await CourseApi.createCourse(course);
        window.location.href = "http://localhost:8080/#/courses";
      } catch (e) {
        this.setState({ validationErrors: {}, error: "Someting went wrong while creating course..." });
      }
    } else {
      try {
        await CourseApi.updateCourse(course.id, course);
        this.setState({ validationErrors: {} });
        alert("Course updated!");
      } catch (e) {
        this.setState({ validationErrors: {}, error: "Someting went wrong while saving course..." });
      }
    }
  };

  handleConfirmDelete = async () => {
    try {
      await CourseApi.deleteCourse(this.getCourseId());
      alert("Course deleted!");
      window.location.href = "http://localhost:8080/#/courses";
    } catch (err) {
      this.setState({
        error: "Error occurred while deleting the course"
      });
    }
  };

  isCreating() {
    return this.getCourseId() === "create";
  }
  getCourseId() {
    return this.props.match.params.id;
  }

  renderForm() {
    const {
      course: { title, language, fee, maxStudent, description },
      validationErrors
    } = this.state;
    return (
      <div>
        {!this.isCreating() && (
          <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#deleteCourseModal">
            Delete Course
          </button>
        )}

        <div className="modal fade" id="deleteCourseModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure to continue</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">Are you sure you want to delete this course?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  data-dismiss="modal"
                  onClick={this.handleConfirmDelete}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>

        <form className="lms-form__container" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Title</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                name="title"
                value={title}
                onChange={this.handleFieldChange}
                placeholder="Title"
              />
              {validationErrors.title && <div className="text-danger">{validationErrors.title}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Language</label>
            <span className="col-sm-9">
              <select className="form-control w-25" name="language" value={language} onChange={this.handleFieldChange}>
                <option>--Select--</option>
                <option value="csharp">C#</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="python">Python</option>
              </select>
              {validationErrors.language && <div className="text-danger">{validationErrors.language}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Fee($)</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                name="fee"
                value={fee}
                onChange={this.handleFieldChange}
                placeholder="Fee($)"
              />
              {validationErrors.fee && <div className="text-danger">{validationErrors.fee}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Max Students</label>
            <span className="col-sm-9">
              <select
                className="form-control w-25"
                name="maxStudent"
                value={maxStudent}
                onChange={this.handleFieldChange}
              >
                <option>--Select--</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={40}>40</option>
                <option value={50}>50</option>
              </select>
              {validationErrors.maxStudent && <div className="text-danger">{validationErrors.maxStudent}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Description</label>
            <span className="col-sm-9">
              <textarea
                className="form-control"
                name="description"
                value={description}
                onChange={this.handleFieldChange}
                placeholder="Description"
              />
              {validationErrors.description && <div className="text-danger">{validationErrors.description}</div>}
            </span>
          </div>
          <button className="btn btn-primary" type="submit">
            {this.isCreating() ? "Create" : "Save"}
          </button>
          <Link className="btn btn-light ml-3" to="/courses">
            Close
          </Link>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="lms-container">
        <h1>{this.isCreating() ? "New Course" : "Course Detail"}</h1>
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.course && this.renderForm()}
        {!this.state.isLoading && !this.state.course && <h3>Course not found.</h3>}
      </div>
    );
  }
}

export default CourseDetails;
