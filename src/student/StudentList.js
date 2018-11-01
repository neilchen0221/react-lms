import React from "react";
import * as StudentApi from "./StudentApi";
import Loader from "../common/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import { range } from "lodash";
import Notification from "../common/Notification";

class StudentList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      isPageLoading: false,
      isLoading: true,
      students: []
    };
  }

  getStudentsByPage = async pageNumber => {
    this.setState({ currentPage: pageNumber, isLoadingPage: true });

    try {
      const data = await StudentApi.getStudents(pageNumber);
      this.setState({
        students: data.students,
        totalPage: data.totalPage,
        isLoadingPage: false,
        isLoading: false,
        error: ""
      });
    } catch (e) {
      this.setState({
        error: "Something went wrong...",
        isLoading: false,
        isLoadingPage: false
      });
    }
  };

  async componentDidMount() {
    await this.getStudentsByPage(1);
  }

  renderHead() {
    return (
      <thead>
        <tr>
          <th>Name</th>
          <th style={{ with: 300 }}>Email</th>
          <th style={{ width: 70 }}>Gender</th>
          <th style={{ width: 150 }}>Date of birth</th>
          <th style={{ width: 70 }}>Credit</th>
          <th style={{ width: 120 }} />
        </tr>
      </thead>
    );
  }

  renderBody() {
    return (
      <tbody>
        {this.state.isLoadingPage && (
          <tr>
            <td>
              <Loader />
            </td>
          </tr>
        )}
        {!this.state.isLoadingPage &&
          this.state.students.map(student => (
            <tr key={student.id}>
              <td>{student.fullName}</td>
              <td>{student.email}</td>
              <td>{student.gender}</td>
              <td>{moment(student.dateOfBirth).format("MMM DD YYYY")}</td>
              <td>{student.credit}</td>
              <td style={{ textAlign: "right" }}>
                <Link to={`/students/${student.id}`}>Details</Link>
              </td>
            </tr>
          ))}
      </tbody>
    );
  }

  renderPages() {
    const { totalPage, currentPage } = this.state;
    const hasPrev = currentPage > 1;
    const hasNext = currentPage < totalPage;

    let pageNumber = [];
    if (totalPage < 3) {
      pageNumber = range(1, totalPage + 1);
    } else {
      if (currentPage === 1) {
        pageNumber = [1, 2, 3];
      } else if (currentPage === totalPage) {
        pageNumber = [totalPage - 2, totalPage - 1, totalPage];
      } else {
        pageNumber = [currentPage - 1, currentPage, currentPage + 1];
      }
    }

    return (
      <div>
        {hasPrev && <a onClick={this.getStudentsByPage.bind(this, currentPage - 1)}>Previous </a>}
        {hasNext && <a onClick={this.getStudentsByPage.bind(this, currentPage + 1)}>Next</a>}
        <ul>
          {pageNumber.map(pageNumber => (
            <a
              key={pageNumber}
              onClick={currentPage === pageNumber ? undefined : this.getStudentsByPage.bind(this, pageNumber)}
            >
              {pageNumber}
            </a>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <h1>Students</h1>
        <Link to="students/create">New Students</Link>
        {this.state.error && <Notification>{this.state.error}</Notification>}

        {this.state.isLoading && <Loader />}
        {!this.state.isLoading &&
          !this.state.error && (
            <div>
              <table>
                {this.renderHead()}
                {this.renderBody()}
              </table>
              <br />
              {this.renderPages()}
            </div>
          )}
      </div>
    );
  }
}

export default StudentList;
