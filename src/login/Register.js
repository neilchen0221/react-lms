import React from "react";
import TextField from "../common/TextField";
import Notification from "../common/Notification";
import { getValidationErrors, redirect } from "../common/Helper";
import * as yup from "yup";
import { pick } from "lodash/object";
import * as LoginApi from "./LoginApi";

const schema = yup.object().shape({
  userName: yup
    .string()
    .label("Username")
    .required(),
  firstName: yup
    .string()
    .label("First Name")
    .required(),
  lastName: yup
    .string()
    .label("Last Name")
    .required(),
  email: yup
    .string()
    .email()
    .label("Email")
    .required(),
  password: yup
    .string()
    .label("Password")
    .required(),
  confirmPassword: yup
    .string()
    .test("comparePassword", "Passwords do not match", function(confirmPassword) {
      return confirmPassword === this.parent.password;
    })
    .label("Confirm Password")
    .required()
});

export default class Register extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      registerData: {
        userName: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      },
      isRegistering: false,
      validationErrors: {},
      registerError: ""
    };
  }

  handleFieldChange = e => {
    const { name, value } = e.target;
    this.setState({
      registerData: {
        ...this.state.registerData,
        [name]: value
      }
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    // Validate user input
    const userInput = pick(this.state.registerData, [
      "userName",
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword"
    ]);
    try {
      await schema.validate(userInput, { abortEarly: false });
    } catch (err) {
      const validationErrors = getValidationErrors(err);
      this.setState({ validationErrors });
      return;
    }

    // Try to register
    try {
      this.setState({ validationErrors: {}, isRegistering: true });
      await LoginApi.registerUser(userInput);
      this.setState({ loginError: "", isRegistering: false });
      redirect("/login");
    } catch (err) {
      console.log(err);
      this.setState({
        loginError: "Sorry, error occurred while registering",
        isRegistering: false
      });
    }
  };

  render() {
    const {
      registerData: { userName, firstName, lastName, email, password, confirmPassword },
      validationErrors,
      registerError,
      isRegistering
    } = this.state;
    return (
      <div className="row">
        <div className=" mx-auto mt-5 col-sm-10 col-xl-5">
          <h3 className="text-center">Please Sign Up</h3>
          <form className="lms-form__container" onSubmit={this.handleSubmit}>
            {registerError && <Notification>{registerError}</Notification>}
            <TextField
              name="userName"
              label="Username"
              value={userName}
              onChange={this.handleFieldChange}
              placeholder="Username"
              error={validationErrors.userName}
            />

            <TextField
              name="firstName"
              label="First Name"
              value={firstName}
              onChange={this.handleFieldChange}
              placeholder="FirstName"
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

            <TextField
              name="email"
              label="Email"
              value={email}
              onChange={this.handleFieldChange}
              placeholder="Email"
              error={validationErrors.email}
            />

            <TextField
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={this.handleFieldChange}
              placeholder="Password"
              error={validationErrors.password}
            />

            <TextField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              value={confirmPassword}
              onChange={this.handleFieldChange}
              placeholder="Confirm Password"
              error={validationErrors.confirmPassword}
            />
            <div className="text-center">
              <button type="submit" className="btn btn-primary mr-2">
                {isRegistering && <i className="fa fa-spinner fa-spin mr-2" />}
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
