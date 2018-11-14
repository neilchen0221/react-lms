import React from "react";
import axios from "axios";
import TextField from "../common/TextField";
import Notification from "../common/Notification";
import { getValidationErrors, redirect } from "../common/Helper";
import * as yup from "yup";
import { pick } from "lodash/object";
import * as LoginApi from "./LoginApi";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  username: yup
    .string()
    .label("Username")
    .required(),
  password: yup
    .string()
    .label("Password")
    .required()
});

export default class Login extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      isLoggingIn: false,
      validationErrors: {},
      loginError: ""
    };
  }

  handleFieldChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();

    // Validate user input
    const userInput = pick(this.state, ["username", "password"]);
    try {
      await schema.validate(userInput, { abortEarly: false });
    } catch (err) {
      const validationErrors = getValidationErrors(err);
      this.setState({ validationErrors });
      return;
    }

    // Try to login
    try {
      this.setState({ validationErrors: {}, isLoggingIn: true });
      const response = await LoginApi.getAccessToken(userInput.username, userInput.password);
      this.setState({ loginError: "", isLoggingIn: false });

      // Update bearer token
      axios.defaults.headers.common.Authorization = `Bearer ${response.access_token}`;
      localStorage.setItem("access_token", response.access_token);
      redirect("/dashboard");
      window.location.reload();
    } catch (err) {
      console.log(err);
      this.setState({
        loginError: err.data.error_description || "Sorry, error occurred when logging in",
        isLoggingIn: false
      });
    }
  };

  render() {
    const { username, password, validationErrors, loginError, isLoggingIn } = this.state;
    return (
      <div className="row">
        <div className="mx-auto mt-5 col-md-3">
          <h3 className="text-center">Please login</h3>
          <form className="lms-form__container" onSubmit={this.handleSubmit}>
            {loginError && <Notification>{loginError}</Notification>}
            <TextField
              name="username"
              label={<i className="fas fa-user fa-2x pl-3" />}
              value={username}
              onChange={this.handleFieldChange}
              placeholder="Username"
              error={validationErrors.username}
            />
            <TextField
              type="password"
              name="password"
              label={<i className="fas fa-unlock-alt fa-2x pl-3" />}
              value={password}
              onChange={this.handleFieldChange}
              placeholder="Password"
              error={validationErrors.password}
            />
            <div className="text-center">
              <button type="submit" className="btn btn-primary mr-2">
                {isLoggingIn && <i className="fa fa-spinner fa-spin mr-2" />}
                Login
              </button>
              <Link className="btn btn-light" to="/register">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
