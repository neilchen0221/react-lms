import React from "react";
import * as yup from "yup";
import * as StudentApi from "./StudentApi";
import Notification from "../common/Notification";
import Loader from "../common/Loader";
import { pick } from "lodash/object";
import { getValidationErrors, redirect } from "../common/Helper";
import { Link } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";
import TextField from "../common/TextField";
import Selector from "../common/Selector";
import moment from "moment";
import StudentEnroll from "./StudentEnroll";

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
    .matches(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/, "Please follow YYYY-MM-DD date format")
    .label("Date of birth")
    .required(),
  email: yup
    .string()
    .email()
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
      isUpdated: false,
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
        this.setState({
          isLoading: false,
          student: { ...student, dateOfBirth: moment(student.dateOfBirth).format("YYYY-MM-DD") }
        });
      } catch (err) {
        console.log(err);
        this.setState({
          error: "Error occurred while loading the student"
        });
      }
    }
  }

  getStudent = async () => {
    try {
      this.setState({ isLoading: true });
      const student = await StudentApi.getStudentById(this.getStudentId());
      this.setState({
        isLoading: false,
        student: { ...student, dateOfBirth: moment(student.dateOfBirth).format("YYYY-MM-DD") }
      });
    } catch (err) {
      console.log(err);
      this.setState({
        error: "Error occurred while loading the student"
      });
    }
  };

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

    // validate user input
    try {
      await schema.validate(userInput, {
        abortEarly: false
      });
    } catch (err) {
      const validationErrors = getValidationErrors(err);
      this.setState({ validationErrors });
      return;
    }

    // try to submit form
    const { student } = this.state;
    if (this.isCreating()) {
      try {
        await StudentApi.createStudent(student);
        alert("Student created successfully!");
        redirect("/students");
      } catch (e) {
        this.setState({
          error: e.data.message || "Something went wrong while creating student... :("
        });
      }
    } else {
      this.setState({ isUpdated: false });
      await StudentApi.updateStudent(student.id, student);
      this.setState({ validationErrors: {}, isUpdated: true });
    }
  };

  handleConfirmDelete = async () => {
    try {
      await StudentApi.deleteStudent(this.getStudentId());
      alert("Student deleted!");
      redirect("/students");
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
          <React.Fragment>
            <button
              type="button"
              className="btn btn-danger mt-3 mx-3"
              data-toggle="modal"
              data-target="#deleteStudentModal"
            >
              Delete Student
            </button>

            <ConfirmDialog
              id="deleteStudentModal"
              handleConfirm={this.handleConfirmDelete}
              title="Are you sure to continue"
              body="Are you sure you want to delete this student?"
            />
          </React.Fragment>
        )}

        {this.state.isUpdated && <Notification type="success">Student updated</Notification>}

        <form className="lms-form__container" onSubmit={this.handleSubmit}>
          <TextField
            name="firstName"
            label="First Name"
            value={firstName}
            onChange={this.handleFieldChange}
            placeholder="First Name"
            error={validationErrors.firstName}
          />
          <TextField
            name="lastName"
            label="Last Name"
            value={lastName}
            onChange={this.handleFieldChange}
            placeholder="Last Name"
            error={validationErrors.lastName}
          />

          <Selector
            style={{ width: "120px" }}
            name="gender"
            label="Gender"
            value={gender}
            onChange={this.handleFieldChange}
            error={validationErrors.gender}
          >
            <option value="">--Select--</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </Selector>

          <TextField
            style={{ width: "200px" }}
            name="dateOfBirth"
            label="Date Of Birth"
            value={dateOfBirth}
            onChange={this.handleFieldChange}
            placeholder="Date Of Birth"
            error={validationErrors.dateOfBirth}
          />

          <TextField
            name="email"
            label="Email"
            value={email}
            onChange={this.handleFieldChange}
            placeholder="Email"
            error={validationErrors.email}
          />

          <TextField
            style={{ width: "100px" }}
            name="credit"
            label="Credit"
            value={credit}
            onChange={this.handleFieldChange}
            placeholder="Credit"
            error={validationErrors.credit}
          />

          <button className="btn btn-primary" type="submit">
            {this.isCreating() ? "Create" : "Save"}
          </button>
          <Link className="btn btn-light border ml-3" to="/students">
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
            <i className="fas fa-address-card mx-3" />
            {this.isCreating() ? "New Student" : "Student Detail"}
          </h1>
          {this.state.error && <Notification>{this.state.error}</Notification>}
          {this.state.isLoading && <Loader />}
          {!this.state.isLoading && this.state.student && this.renderForm()}
        </div>
        {!this.isCreating() && <StudentEnroll studentId={this.getStudentId()} reloadStudent={this.getStudent} />}
      </div>
    );
  }
}

export default StudentDetails;
