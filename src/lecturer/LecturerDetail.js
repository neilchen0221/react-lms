import React from "react";
import * as LecturerApi from "./LecturerApi";
import TextField from "../common/TextField";
import Notification from "../common/Notification";
import Loader from "../common/Loader";
import TextAreaField from "../common/TextAreaField";
import * as yup from "yup";
import { pick } from "lodash/object";
import { getValidationErrors } from "../common/Helper";
import { Link } from "react-router-dom";
import ConfirmDialog from "../common/ConfirmDialog";

const schema = yup.object().shape({
  name: yup
    .string()
    .max(50)
    .label("Name")
    .required(),
  staffNumber: yup
    .string()
    .max(50)
    .label("Staff Number")
    .required(),
  email: yup
    .string()
    .email()
    .label("Email")
    .required(),
  bibliography: yup
    .string()
    .max(250)
    .label("Bibliography")
});

class LecturerDetails extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      isUpdated: false,
      validationErrors: {},
      error: "",
      lecturer: {
        name: "",
        staffNumber: "",
        email: "",
        bibliography: ""
      }
    };
  }

  async componentDidMount() {
    if (!this.isCreating()) {
      this.setState({ isLoading: true });
      const lecturer = await LecturerApi.getLecturerById(this.props.match.params.id);
      this.setState({ isLoading: false, lecturer: lecturer });
    }
  }

  handleFieldChange = e => {
    const {
      target,
      target: { name }
    } = e;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      lecturer: {
        ...this.state.lecturer,
        [name]: value
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    const userInput = pick(this.state.lecturer, ["name", "staffNumber", "email", "bibliography"]);
    try {
      await schema.validate(userInput, {
        abortEarly: false
      });
    } catch (err) {
      const validationErrors = getValidationErrors(err);
      this.setState({ validationErrors });
      return;
    }

    const { lecturer } = this.state;
    if (this.isCreating()) {
      try {
        await LecturerApi.createLecturer(lecturer);
        this.setState({ validationErrors: {} });
        window.location.href = "http://localhost:8080/#/lecturers";
      } catch (e) {
        this.setState({ validationErrors: {}, error: "Someting went wrong while creating lecturer..." });
      }
    } else {
      try {
        this.setState({ isUpdated: false });
        await LecturerApi.updateLecturer(lecturer.id, lecturer);
        this.setState({ validationErrors: {}, isUpdated: true });
      } catch (e) {
        this.setState({ validationErrors: {}, error: "Someting went wrong while saving lecturer..." });
      }
    }
  };

  handleConfirmDelete = async () => {
    try {
      await LecturerApi.deleteLecturer(this.getLecturerId());
      alert("lecturer deleted!");
      window.location.href = "http://localhost:8080/#/lecturers";
    } catch (err) {
      this.setState({
        error: "Error occurred while deleting the lecturer"
      });
    }
  };

  isCreating() {
    return this.getLecturerId() === "create";
  }
  getLecturerId() {
    return this.props.match.params.id;
  }

  renderForm() {
    const {
      lecturer: { name, staffNumber, email, bibliography },
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
              data-target="#deleteLecturerModal"
            >
              Delete Lecturer
            </button>
            <ConfirmDialog
              id="deleteLecturerModal"
              handleConfirm={this.handleConfirmDelete}
              title="Are you sure to continue"
              body="Are you sure you want to delete this lecturer?"
            />
          </React.Fragment>
        )}

        {this.state.isUpdated && <Notification type="success">Lecturer updated</Notification>}

        <form className="lms-form__container" onSubmit={this.handleSubmit}>
          <TextField
            name="name"
            label="Name"
            value={name}
            onChange={this.handleFieldChange}
            placeholder="Name"
            error={validationErrors.name}
          />
          <TextField
            name="staffNumber"
            label="Staff Number"
            value={staffNumber}
            onChange={this.handleFieldChange}
            placeholder="Staff Number"
            error={validationErrors.staffNumber}
          />
          <TextField
            name="email"
            label="Email"
            value={email}
            onChange={this.handleFieldChange}
            placeholder="Email"
            error={validationErrors.email}
          />
          <TextAreaField
            name="bibliography"
            label="Bibliography"
            value={bibliography}
            onChange={this.handleFieldChange}
            placeholder="Bibliography"
            error={validationErrors.bibliography}
          />

          <button className="btn btn-primary mr-3" type="submit">
            {this.isCreating() ? "Create" : "Save"}
          </button>
          <Link className="btn btn-light" to="/lecturers">
            Close
          </Link>
        </form>
      </div>
    );
  }

  render() {
    return (
      <div className="lms-container mx-1 mx-sm-5">
        <h1>
          <i className="fas fa-chalkboard-teacher mx-3" />
          {this.isCreating() ? "New Lecturer" : "Lecturer Detail"}
        </h1>
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && this.state.lecturer && this.renderForm()}
        {!this.state.isLoading && !this.state.lecturer && <h3>Lecturer not found.</h3>}
      </div>
    );
  }
}

export default LecturerDetails;
