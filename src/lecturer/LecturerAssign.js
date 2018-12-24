import React from 'react';
import Notification from '../common/Notification';
import Loader from '../common/Loader';
import * as LecturerApi from './LecturerApi';
import { Link } from 'react-router-dom';
import * as CourseApi from '../course/CourseApi';
import ConfirmDialog from '../common/ConfirmDialog';
import Portal from '../common/Portal';

class LecturerAssign extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isAssigned: false,
      isLoading: false,
      isTableLoading: false,
      loadingError: '',
      error: '',
      isAssignMode: false,
      lecturerCourses: [],
      courses: []
    };
  }

  async componentDidMount() {
    this.getLecturerCourse();
  }

  getLecturerCourse = async () => {
    try {
      this.setState({ isLoading: true });
      const lecturerCourses = await LecturerApi.getLecturerCourse(this.props.lecturerId);
      this.setState({ isLoading: false, lecturerCourses });
    } catch (error) {
      this.setState({
        isLoading: false,
        loadingError: 'Something went wrong while loading...'
      });
    }
  };

  getCourses = async () => {
    try {
      this.setState({ isTableLoading: true });
      const courses = await CourseApi.getCourses();
      this.setState({ isTableLoading: false, courses });
    } catch (e) {
      this.setState({ isTableLoading: false, error: 'Something went wrong while loading courses...' });
    }
  };

  handleAssignMode = async () => {
    await this.setState({ isAssignMode: !this.state.isAssignMode });
    this.getCourses();
  };

  handleAssign = async courseId => {
    try {
      this.setState({ isAssigned: false, error: '' });
      await LecturerApi.assignCourse(this.props.lecturerId, courseId);
      await this.getLecturerCourse();
      this.setState({ isAssigned: true });
    } catch (e) {
      this.setState({
        error: 'Something went wrong while assigning course... :('
      });
    }
  };

  handleUnassign = async courseId => {
    try {
      this.setState({ isAssigned: false, error: '' });
      await LecturerApi.unassignCourse(this.props.lecturerId, courseId);
      await this.getLecturerCourse();
    } catch (e) {
      this.setState({ error: 'Something went wrong while unassigning course...' });
    }
  };

  renderCourseList = () => {
    const { lecturerCourses, isAssignMode } = this.state;
    return (
      <div className="row mt-5">
        {lecturerCourses.map(c => {
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
                  <button className="btn btn-danger" data-toggle="modal" data-target={`#unassignCourse${c.id}`}>
                    Unassign Course
                  </button>
                  <ConfirmDialog
                    id={`unassignCourse${c.id}`}
                    handleConfirm={this.handleUnassign.bind(this, c.id)}
                    title="Are you sure to continue"
                    body={`Unassign this lecturer from course - ${c.title}?`}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <div className="col-sm-6 text-center">
          {!lecturerCourses.length && <h3>No course assigned, start to assign course</h3>}
          <button className="btn btn-light btn-lg border px-5 py-4 mt-5 " onClick={this.handleAssignMode}>
            {isAssignMode ? 'Close' : <span className="fas fa-plus" />}
          </button>
        </div>
      </div>
    );
  };

  renderTable() {
    return (
      <div className="table-responsive mt-4 lms-section">
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
                    {this.state.lecturerCourses.filter(x => x.id === course.id).length ? (
                      <button className="btn btn-secondary" disabled>
                        Assigned
                      </button>
                    ) : (
                      <React.Fragment>
                        <button
                          className="btn btn-primary"
                          data-toggle="modal"
                          data-target={`#assignCourse${course.id}`}
                        >
                          Assign Course
                        </button>
                        <Portal>
                          <ConfirmDialog
                            id={`assignCourse${course.id}`}
                            handleConfirm={this.handleAssign.bind(this, course.id)}
                            title="Are you sure to continue"
                            body={`Assign this lecturer to ${course.title}?`}
                          />
                        </Portal>
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
        <h1>Assigned Courses</h1>
        {this.state.loadingError && <Notification>{this.state.loadingError}</Notification>}
        {this.state.isAssigned && <Notification type="success">Course assigned successfully!</Notification>}
        {this.state.error && <Notification>{this.state.error}</Notification>}
        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && !this.state.loadingError && this.renderCourseList()}
        {this.state.isAssignMode && this.renderTable()}
      </div>
    );
  }
}

export default LecturerAssign;
