import React from "react";
import * as StudentApi from "./StudentApi";
import Loader from "../common/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import { range } from "lodash";
import Notification from "../common/Notification";
import classnames from "classnames";

class StudentList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      isPageLoading: false,
      isLoading: true,
      searchAttr: {
        searchValue: ""
      },
      students: []
    };
  }

  async componentDidMount() {
    await this.getStudentsByPage(1);
  }

  handleFieldChange = e => {
    this.setState({
      searchAttr: { searchValue: e.target.value }
    });
  };

  getStudentsByPage = async pageNumber => {
    const {
      searchAttr: { searchValue }
    } = this.state;

    this.setState({ currentPage: pageNumber, isLoadingPage: true });

    try {
      const data = await StudentApi.getStudents(pageNumber, searchValue);
      this.setState({
        students: data.students,
        totalPage: data.totalPage,
        isLoadingPage: false,
        isLoading: false,
        error: ""
      });
    } catch (e) {
      console.log(e);
      this.setState({
        error: "Something went wrong...",
        isLoading: false,
        isLoadingPage: false
      });
    }
  };

  renderHead() {
    return (
      <thead>
        <tr>
          <th style={{ fontWeight: "bold" }}>Name</th>
          <th style={{ width: 450, fontWeight: "bold" }}>Email</th>
          <th style={{ width: 70, fontWeight: "bold" }}>Gender</th>
          <th style={{ width: 150, fontWeight: "bold" }}>Date of birth</th>
          <th style={{ width: 70, fontWeight: "bold" }}>Credit</th>
          <th style={{ width: 120, fontWeight: "bold" }} />
        </tr>
      </thead>
    );
  }

  renderBody() {
    return (
      <tbody>
        {this.state.isLoadingPage && (
          <tr>
            <td colSpan="6">
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
        <ul className="pagination pagination-lg justify-content-center">
          {
            <li className={classnames("page-item", { disabled: !hasPrev })}>
              <a className="page-link" onClick={this.getStudentsByPage.bind(this, currentPage - 1)}>
                Previous
              </a>
            </li>
          }
          {pageNumber.map(pageNumber => (
            <li key={pageNumber} className={classnames("page-item", { active: currentPage === pageNumber })}>
              <a
                className="page-link"
                onClick={currentPage === pageNumber ? undefined : this.getStudentsByPage.bind(this, pageNumber)}
              >
                {pageNumber}
              </a>
            </li>
          ))}
          {
            <li className={classnames("page-item", { disabled: !hasNext })}>
              <a className="page-link" onClick={this.getStudentsByPage.bind(this, currentPage + 1)}>
                Next
              </a>
            </li>
          }
        </ul>
      </div>
    );
  }

  render() {
    const {
      searchAttr: { searchValue }
    } = this.state;

    return (
      <div className="lms-list__container">
        <h1>Students</h1>
        <Link className="btn btn-primary my-3" to="students/create">
          New Students
        </Link>

        <form onSubmit={e => e.preventDefault()} className="form-inline my-3 float-right">
          <input
            className="form-control mr-sm-2"
            type="search"
            name="searchValue"
            value={searchValue}
            placeholder="Search"
            onChange={this.handleFieldChange}
          />
          <button
            className="btn btn-outline-primary my-2 my-sm-0"
            type="submit"
            onClick={this.getStudentsByPage.bind(this, 1)}
          >
            <i className="fa fa-search" />
          </button>
        </form>

        {this.state.error && <Notification>{this.state.error}</Notification>}

        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && !this.state.error && (
          <div style={{ marginTop: "10px" }}>
            <table className="table table-striped">
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
