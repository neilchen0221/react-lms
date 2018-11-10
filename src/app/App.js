import React from "react";
import { Route, HashRouter as Router, Switch, Redirect } from "react-router-dom";
import CourseList from "../course/CourseList";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../common/NotFound";
import CourseDetails from "../course/CourseDetails";
import StudentList from "../student/StudentList";
import Navbar from "./Navbar";
import StudentDetails from "../student/StudentDetail";
import LecturerList from "../lecturer/LecturerList";
import LecturerDetails from "../lecturer/LecturerDetail";
import Login from "../login/Login";
import "../style.css";

export default function App() {
  return (
    <Router>
      <div>
        <Navbar />

        <Switch>
          <Redirect exact path="/" to="/dashboard" />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/courses" component={CourseList} />
          <Route exact path="/courses/:id(\d+|create)" component={CourseDetails} />
          <Route exact path="/students" component={StudentList} />
          <Route exact path="/students/:id(\d+|create)" component={StudentDetails} />
          <Route exact path="/lecturers" component={LecturerList} />
          <Route exact path="/lecturers/:id(\d+|create)" component={LecturerDetails} />
          <Route exact path="/login" component={Login} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}
