import React from "react";
import * as yup from "yup";
import * as StudentApi from "./StudentApi";
import Notification from "../common/Notification";
import Loader from "../common/Loader";
import { pick } from "lodash/object";
import { getValidationErrors } from "../common/Helper";
import { Link } from "react-router-dom";

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
        console.log(err);
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

        <form className="lms-form__container" onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">First Name</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                name="firstName"
                value={firstName}
                onChange={this.handleFieldChange}
                placeholder="First Name"
              />
              {validationErrors.firstName && <div className="text-danger">{validationErrors.firstName}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Last Name</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                name="lastName"
                value={lastName}
                onChange={this.handleFieldChange}
                placeholder="Last Name"
              />
              {validationErrors.lastName && <div className="text-danger">{validationErrors.lastName}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Gender</label>
            <span className="col-sm-9">
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
              {validationErrors.gender && <div className="text-danger">{validationErrors.gender}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Date of birth</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                style={{ width: "200px" }}
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={this.handleFieldChange}
                placeholder="Date of Birth"
              />
              {validationErrors.dateOfBirth && <div className="text-danger">{validationErrors.dateOfBirth}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Email</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                name="email"
                value={email}
                onChange={this.handleFieldChange}
                placeholder="Email"
              />
              {validationErrors.email && <div className="text-danger">{validationErrors.email}</div>}
            </span>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold">Credit</label>
            <span className="col-sm-9">
              <input
                className="form-control"
                style={{ width: "100px" }}
                name="credit"
                value={credit}
                onChange={this.handleFieldChange}
                placeholder="Credit"
              />
              {validationErrors.credit && <div className="text-danger">{validationErrors.credit}</div>}
            </span>
          </div>
          <button className="btn btn-primary" type="submit">
            {this.isCreating() ? "Create" : "Save"}
          </button>
          <Link className="btn btn-light ml-3" to="/students">
            Close
          </Link>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="lms-container">
        <h1>{this.isCreating() ? "New Student" : "Student Detail"}</h1>
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.student && this.renderForm()}
      </div>
    );
  }
}

export default StudentDetails;
