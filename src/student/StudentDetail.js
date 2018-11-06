import React from "react";
import * as yup from "yup";
import * as StudentApi from "./StudentApi";
import Notification from "../common/Notification";
import Loader from "../common/Loader";
import { pick } from "lodash/object";
import { getValidationErrors } from "../common/Helper";
import "../style.css";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .max(50)
    .label("First name")
    .required(),
  lastName: yup
    .string()
    .max(50)
    .label("Last name")
    .required(),
  gender: yup
    .string()
    .label("Gender")
    .required(),
  dateOfBirth: yup
    .string()
    .label("Date of birth")
    .required(),
  email: yup
    .string()
    .label("Email")
    .required(),
  credit: yup
    .number()
    .positive()
    .label("Credit")
    .required()
});

class StudentDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      validationErrors: {},
      error: "",
      student: {
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "1999-01-01",
        email: "",
        credit: 0
      }
    };
  }

  async componentDidMount() {
    if (!this.isCreating()) {
      try {
        this.setState({ isLoading: true });
        const student = await StudentApi.getStudentById(this.getStudentId());
        this.setState({ isLoading: false, student: student });
      } catch (err) {
        this.setState({
          error: "Error occurred while loading the student"
        });
      }
    }
  }

  handleFieldChange = e => {
    const {
      target,
      target: { name }
    } = e;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      student: {
        ...this.state.student,
        [name]: value
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const userInput = pick(this.state.student, ["firstName", "lastName", "gender", "dateOfBirth", "email", "credit"]);
    try {
      await schema.validate(userInput, {
        abortEarly: false
      });
    } catch (err) {
      const validationErrors = getValidationErrors(err);
      this.setState({ validationErrors });
      return;
    }

    const { student } = this.state;
    if (this.isCreating()) {
      await StudentApi.createStudent(student);
      window.location.href = "http://localhost:8080/#/students";
    } else {
      await StudentApi.updateStudent(student.id, student);
      this.setState({ validationErrors: {} });
      alert("Student updated!");
    }
  };

  handleConfirmDelete = async () => {
    try {
      await StudentApi.deleteStudent(this.getStudentId());
      alert("Student deleted!");
      window.location.href = "http://localhost:8080/#/students";
    } catch (err) {
      this.setState({
        error: "Error occurred while deleting the student"
      });
    }
  };

  isCreating() {
    return this.getStudentId() === "create";
  }
  getStudentId() {
    return this.props.match.params.id;
  }

  renderForm() {
    const {
      student: { firstName, lastName, gender, dateOfBirth, email, credit },
      validationErrors
    } = this.state;
    return (
      <div>
        {!this.isCreating() && (
          <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#deleteStudentModal">
            Delete Student
          </button>
        )}

        <div className="modal fade" id="deleteStudentModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Are you sure to continue</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">Are you sure you want to delete this student?</div>
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

        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-4">First Name</label>
            <input
              className="form-control col-sm-8"
              name="firstName"
              value={firstName}
              onChange={this.handleFieldChange}
            />
            {validationErrors.firstName && <p style={{ color: "red" }}>{validationErrors.firstName}</p>}
          </div>
          <div className="form-group row">
            <label className="col-sm-4">Last Name</label>
            <input
              className="form-control col-sm-8"
              name="lastName"
              value={lastName}
              onChange={this.handleFieldChange}
            />
            {validationErrors.lastName && <p style={{ color: "red" }}>{validationErrors.lastName}</p>}
          </div>
          <div className="form-group row">
            <label className="col-sm-4">Gender</label>
            <select
              className="form-control"
              style={{ width: "120px" }}
              name="gender"
              value={gender}
              onChange={this.handleFieldChange}
            >
              <option>--Select--</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            {validationErrors.gender && <p style={{ color: "red" }}>{validationErrors.gender}</p>}
          </div>
          <div className="form-group row">
            <label className="col-sm-4">Date of birth</label>
            <input
              className="form-control"
              style={{ width: "200px" }}
              name="dateOfBirth"
              value={dateOfBirth}
              onChange={this.handleFieldChange}
            />
            {validationErrors.dateOfBirth && <p style={{ color: "red" }}>{validationErrors.dateOfBirth}</p>}
          </div>
          <div className="form-group row">
            <label className="col-sm-4">Email</label>
            <input className="form-control col-sm-8" name="email" value={email} onChange={this.handleFieldChange} />
            {validationErrors.email && <p style={{ color: "red" }}>{validationErrors.email}</p>}
          </div>
          <div className="form-group row">
            <label className="col-sm-4">Credit</label>
            <input
              className="form-control"
              style={{ width: "100px" }}
              name="credit"
              value={credit}
              onChange={this.handleFieldChange}
            />
          </div>
          <button className="btn btn-primary" type="submit">
            {this.isCreating() ? "Create" : "Save"}
          </button>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="lms-form_container">
        <h1>{this.isCreating() ? "New Student" : "Student Detail"}</h1>
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.student && this.renderForm()}
      </div>
    );
  }
}

export default StudentDetails;
