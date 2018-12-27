import React from 'react';
import Loader from '../common/Loader';
import { Link } from 'react-router-dom';
import Notification from '../common/Notification';
import * as LecturerApi from './LecturerApi';

class LecturerList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      error: '',
      lecturers: []
    };
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const lecturers = await LecturerApi.getLecturers();
      this.setState({ lecturers: lecturers || [], isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false, error: 'Something went wrong while loading lecturers...' });
    }
  }

  renderHead() {
    return (
      <thead>
        <tr>
          <th
            className="sticky-col"
            style={{
              width: 300,
              fontWeight: 'bold',
              backgroundColor: 'white'
            }}
          >
            Name
          </th>
          <th style={{ fontWeight: 'bold' }}>Email</th>
          <th style={{ width: 200, fontWeight: 'bold' }}>Staff number</th>
          <th style={{ width: 150 }} />
        </tr>
      </thead>
    );
  }

  renderBody() {
    return (
      <tbody>
        {this.state.isLoading && (
          <tr>
            <td colSpan="6">
              <Loader />
            </td>
          </tr>
        )}
        {!this.state.isLoading && !this.state.lecturers.length && (
          <tr>
            <td colSpan="6">
              <h3 className="text-center">No Lecturer...</h3>
            </td>
          </tr>
        )}
        {!this.state.isLoading &&
          this.state.lecturers.map((lecturer, index) => (
            <tr key={lecturer.id}>
              <td
                className="sticky-col"
                style={{
                  backgroundColor: index % 2 === 0 ? '#F2F2F2' : 'white',
                  whiteSpace: 'normal'
                }}
              >
                {lecturer.name}
              </td>
              <td>{lecturer.email}</td>
              <td>{lecturer.staffNumber}</td>
              <td style={{ textAlign: 'right' }}>
                <Link to={`/lecturers/${lecturer.id}`}>Details</Link>
              </td>
            </tr>
          ))}
      </tbody>
    );
  }

  render() {
    return (
      <div className="lms-list__container">
        <h1>
          <i className="fas fa-chalkboard-teacher mx-3" />
          Lecturers
        </h1>
        <Link className="btn btn-primary my-3" to="lecturers/create">
          New Lecturer
        </Link>
        {this.state.error && <Notification>{this.state.error}</Notification>}

        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && !this.state.error && (
          <div className="table-responsive mt-2">
            <table className="table table-striped text-nowrap">
              {this.renderHead()}
              {this.renderBody()}
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default LecturerList;
