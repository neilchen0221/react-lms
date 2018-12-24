import React from 'react';
import Loader from '../common/Loader';
import { Link } from 'react-router-dom';
import * as CourseApi from './CourseApi';
import moment from 'moment';
import Notification from '../common/Notification';

class CoursePeople extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      courseStudents: [],
      courseLecturers: [],
      isStudentsLoading: false,
      isLecturersLoading: false,
      studentsError: '',
      lecturersError: ''
    };
  }

  async componentDidMount() {
    this.setState({ isLecturersLoading: true, isStudentsLoading: true });
    try {
      const courseLecturers = await CourseApi.getCourseLecturer(this.props.courseId);
      this.setState({ isLecturersLoading: false, courseLecturers });
    } catch (e) {
      this.setState({
        isLecturersLoading: false,
        lecturersError: 'Something went wrong while loading lecturer list...'
      });
    }

    try {
      const courseStudents = await CourseApi.getCourseStudent(this.props.courseId);
      this.setState({ isStudentsLoading: false, courseStudents });
    } catch (e) {
      this.setState({ isStudentsLoading: false, studentsError: 'Something went wrong while loading student list...' });
    }
  }

  renderLecturerTable = () => {
    return (
      <div className="table-responsive my-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="font-weight-bold">Name</th>
              <th className="font-weight-bold">Email</th>
              <th className="font-weight-bold">Staff number</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {this.state.isLecturersLoading && (
              <tr>
                <td colSpan="4">
                  <Loader />
                </td>
              </tr>
            )}
            {!this.state.isLecturersLoading && !this.state.courseLecturers.length && (
              <tr>
                <td colSpan="4">
                  <h3 className="text-center">No lecturer is assgined to this course...</h3>
                </td>
              </tr>
            )}
            {!this.state.isLecturersLoading &&
              this.state.courseLecturers.map(lecturer => (
                <tr key={lecturer.id}>
                  <td>{lecturer.name}</td>
                  <td>{lecturer.email}</td>
                  <td>{lecturer.staffNumber}</td>
                  <td className="text-center">
                    <Link to={`/lecturers/${lecturer.id}`}>Details</Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  renderStudentTable = () => {
    return (
      <div className="table-responsive mt-4">
        <table className="table table-striped">
          <thead>
            <tr>
              <th className="font-weight-bold">Name</th>
              <th className="font-weight-bold">Email</th>
              <th className="font-weight-bold">Gender</th>
              <th className="font-weight-bold">Date of Birth</th>
              <th className="font-weight-bold">Credit</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {this.state.isStudentsLoading && (
              <tr>
                <td colSpan="6">
                  <Loader />
                </td>
              </tr>
            )}
            {!this.state.isStudentsLoading && !this.state.courseStudents.length && (
              <tr>
                <td colSpan="6">
                  <h3 className="text-center">No student is enrolled to this course...</h3>
                </td>
              </tr>
            )}
            {!this.state.isStudentsLoading &&
              this.state.courseStudents.map(student => (
                <tr key={student.id}>
                  <td>{student.fullName}</td>
                  <td>{student.email}</td>
                  <td>{student.gender}</td>
                  <td>{moment(student.dateOfBirth).format('MMM DD YYYY')}</td>
                  <td>{student.credit}</td>
                  <td className="text-center">
                    <Link to={`/students/${student.id}`}>Details</Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const { lecturersError, isLecturersLoading, studentsError, isStudentsLoading } = this.state;
    return (
      <div className="col-md-10 col-xl-6 mb-5">
        <div className="lms-section">
          <h1>Lecturers</h1>
          {lecturersError && <Notification>{lecturersError}</Notification>}
          {isLecturersLoading && <Loader />}
          {!isLecturersLoading && !lecturersError && this.renderLecturerTable()}
        </div>
        <div className="lms-section">
          <h1>Students</h1>
          {studentsError && <Notification>{studentsError}</Notification>}
          {isStudentsLoading && <Loader />}
          {!isStudentsLoading && !studentsError && this.renderStudentTable()}
        </div>
      </div>
    );
  }
}

export default CoursePeople;
