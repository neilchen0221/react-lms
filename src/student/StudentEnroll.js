import React from "react";
import Notification from "../common/Notification";
import Loader from "../common/Loader";
import * as StudentApi from "./StudentApi";
import { Link } from "react-router-dom";
import * as CourseApi from "../course/CourseApi";
import ConfirmDialog from "../common/ConfirmDialog";

class StudentEnroll extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isEnrolled: false,
      isLoading: false,
      isTableLoading: false,
      loadingError: "",
      error: "",
      isEnrollMode: false,
      studentCourses: [],
      courses: []
    };
  }

  async componentDidMount() {
    this.getStudentCourse();
  }

  getStudentCourse = async () => {
    try {
      this.setState({ isLoading: true });
      const studentCourses = await StudentApi.getStudentCourse(this.props.studentId);
      this.setState({ isLoading: false, studentCourses });
    } catch (error) {
      this.setState({
        isLoading: false,
        loadingError: "Something went wrong while loading..."
      });
    }
  };

  getCourses = async () => {
    try {
      this.setState({ isTableLoading: true });
      const courses = await CourseApi.getCourses();
      this.setState({ isTableLoading: false, courses });
    } catch (e) {
      this.setState({ isTableLoading: false, error: "Something went wrong while loading courses..." });
    }
  };

  handleEnrollMode = async () => {
    await this.setState({ isEnrollMode: !this.state.isEnrollMode });
    this.getCourses();
  };

  handleEnroll = async courseId => {
    try {
      this.setState({ isEnrolled: false, error: "" });
      await StudentApi.enrollCourse(this.props.studentId, courseId);
      await this.getStudentCourse();
      this.setState({ isEnrolled: true });
      this.props.reloadStudent();
    } catch (e) {
      this.setState({
        error: e.data.message || "Something went wrong while enrolling... :("
      });
    }
  };

  handleCancel = async courseId => {
    try {
      this.setState({ isEnrolled: false, error: "" });
      await StudentApi.cancelCourse(this.props.studentId, courseId);
      await this.getStudentCourse();
      this.props.reloadStudent();
    } catch (e) {
      this.setState({ error: "Something went wrong while canceling course..." });
    }
  };

  renderCourseList = () => {
    const { studentCourses, isEnrollMode } = this.state;
    return (
      <div className="row mt-5">
        {studentCourses.map(c => {
          return (
            <div key={c.id} className="col-sm-6 mb-4">
              <div className="card lms-shadow">
                <div className="card-header">
                  <h5>{c.title}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{c.description}</p>
                  <Link className="btn btn-primary mr-2" to={`/courses/${c.id}`}>
                    Detail
                  </Link>
                  <button className="btn btn-danger" data-toggle="modal" data-target={`#cancelCourse${c.id}`}>
                    Cancel Course
                  </button>
                  <ConfirmDialog
                    id={`cancelCourse${c.id}`}
                    handleConfirm={this.handleCancel.bind(this, c.id)}
                    title="Are you sure to continue"
                    body={`Withdraw this student from course - ${c.title}?`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="col-sm-6 text-center">
          {!studentCourses.length && <h3>No course enrolled, start to enroll course</h3>}
          <button className="btn btn-light btn-lg border px-5 py-4 mt-5 " onClick={this.handleEnrollMode}>
            {isEnrollMode ? "Close" : <span className="fas fa-plus" />}
          </button>
        </div>
      </div>
    );
  };

  renderTable() {
    return (
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="font-weight-bold">Title</th>
              <th className="font-weight-bold">Description</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.state.isTableLoading && (
              <tr>
                <td colSpan="3">
                  <Loader />
                </td>
              </tr>
            )}
            {!this.state.isTableLoading && !this.state.courses.length && (
              <tr>
                <td colSpan="3">
                  <h3 className="text-center">No Courses...</h3>
                </td>
              </tr>
            )}
            {!this.state.isTableLoading &&
              this.state.courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td className="text-center">
                    {this.state.studentCourses.filter(x => x.id === course.id).length ? (
                      <button className="btn btn-secondary" disabled>
                        Enrolled
                      </button>
                    ) : (
                      <React.Fragment>
                        <button
                          className="btn btn-primary"
                          data-toggle="modal"
                          data-target={`#enrollCourse${course.id}`}
                        >
                          Enroll Course
                        </button>
                        <ConfirmDialog
                          id={`enrollCourse${course.id}`}
                          handleConfirm={this.handleEnroll.bind(this, course.id)}
                          title="Are you sure to continue"
                          body={`Enroll this student to ${course.title}?`}
                        />
                      </React.Fragment>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div className="col-md-10 col-xl-6 mb-5">
        <h1>Enrolled Courses</h1>
        {this.state.loadingError && <Notification>{this.state.loadingError}</Notification>}
        {this.state.isEnrolled && <Notification type="success">Course enrolled!</Notification>}
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && !this.state.loadingError && this.renderCourseList()}
        {this.state.isEnrollMode && this.renderTable()}
      </div>
    );
  }
}

export default StudentEnroll;
