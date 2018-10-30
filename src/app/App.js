import React from "react";
import { Route, HashRouter as Router, Switch, Redirect, Link } from "react-router-dom";
import CourseList from "../course/CourseList";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "../common/NotFound";

export default function App() {
  return (
    <Router>
      <div>
        <div>
          <ul>
            <li>
              <Link to="/">Dashboard</Link>
            </li>
            <li>
              <Link to="/courses">Course</Link>
            </li>
          </ul>
        </div>
        <Switch>
          <Redirect exact path="/" to="/dashboard" />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/courses" component={CourseList} />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}
