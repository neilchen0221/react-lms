import React from "react";
import * as CourseApi from "./CourseApi";
import Loader from "../common/Loader";
import * as yup from "yup";
import { pick } from "lodash/object";
import { getValidationErrors, redirect } from "../common/Helper";
import Notification from "../common/Notification";
import { Link } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";
import TextField from "../common/TextField";
import TextAreaField from "../common/TextAreaField";
import Selector from "../common/Selector";
import CoursePeople from "./CoursePeople";

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
    .max(50)
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
      isUpdated: false,
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
        redirect("/courses");
      } catch (e) {
        this.setState({ validationErrors: {}, error: "Someting went wrong while creating course..." });
      }
    } else {
      try {
        this.setState({ isUpdated: false });
        await CourseApi.updateCourse(course.id, course);
        this.setState({ validationErrors: {}, isUpdated: true });
      } catch (e) {
        this.setState({ validationErrors: {}, error: "Someting went wrong while saving course..." });
      }
    }
  };

  handleConfirmDelete = async () => {
    try {
      await CourseApi.deleteCourse(this.getCourseId());
      alert("Course deleted!");
      redirect("/courses");
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
          <React.Fragment>
            <button
              type="button"
              className="btn btn-danger mt-3 mx-3"
              data-toggle="modal"
              data-target="#deleteCourseModal"
            >
              Delete Course
            </button>
            <ConfirmDialog
              id="deleteCourseModal"
              handleConfirm={this.handleConfirmDelete}
              title="Are you sure to continue"
              body="Are you sure you want to delete this course?"
            />
          </React.Fragment>
        )}
        {this.state.isUpdated && <Notification type="success">Course updated</Notification>}
        <form className="lms-form__container" onSubmit={this.handleSubmit}>
          <TextField
            name="title"
            label="Title"
            value={title}
            onChange={this.handleFieldChange}
            placeholder="Title"
            error={validationErrors.title}
          />

          <Selector
            style={{ width: "120px" }}
            name="language"
            label="Language"
            value={language}
            onChange={this.handleFieldChange}
            error={validationErrors.language}
          >
            <option value="">--Select--</option>
            <option value="csharp">C#</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="go">Go</option>
            <option value="ruby">Ruby</option>
            <option value="python">Python</option>
          </Selector>

          <TextField
            name="fee"
            label="Fee($)"
            value={fee}
            onChange={this.handleFieldChange}
            placeholder="Fee($)"
            error={validationErrors.fee}
          />

          <Selector
            style={{ width: "120px" }}
            name="maxStudent"
            label="Max Students"
            value={maxStudent}
            onChange={this.handleFieldChange}
            error={validationErrors.maxStudent}
          >
            <option>--Select--</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </Selector>

          <TextAreaField
            name="description"
            label="Description"
            value={description}
            onChange={this.handleFieldChange}
            placeholder="Description"
            error={validationErrors.description}
          />

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
      <div className="row mt-4 justify-content-around">
        <div className="col-md-10 col-xl-5 mb-5">
          <h1>
            <i className="fas fa-book-open mx-3" />
            {this.isCreating() ? "New Course" : "Course Detail"}
          </h1>
          {this.state.error && <Notification>{this.state.error}</Notification>}
          {this.state.isLoading && <Loader />}
          {!this.state.isLoading && this.state.course && this.renderForm()}
          {!this.state.isLoading && !this.state.course && <h3>Course not found.</h3>}
        </div>
        {!this.isCreating() && <CoursePeople courseId={this.getCourseId()} />}
      </div>
    );
  }
}

export default CourseDetails;
