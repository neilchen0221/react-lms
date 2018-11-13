import React from "react";
import * as StudentApi from "./StudentApi";
import Loader from "../common/Loader";
import moment from "moment";
import { Link } from "react-router-dom";
import { range } from "lodash";
import Notification from "../common/Notification";
import SortControl from "../common/SortControl";
import classnames from "classnames";

class StudentList extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      currentPage: 1,
      isPageLoading: false,
      isLoading: true,
      searchAttr: {
        searchValue: "",
        sortString: "",
        sortOrder: true
      },
      students: []
    };
  }

  async componentDidMount() {
    await this.getStudentsByPage(1);
  }

  handleFieldChange = e => {
    this.setState({
      searchAttr: { ...this.state.searchAttr, searchValue: e.target.value }
    });
  };

  getStudentsByPage = async pageNumber => {
    const {
      searchAttr: { searchValue, sortString, sortOrder }
    } = this.state;

    this.setState({ currentPage: pageNumber, isLoadingPage: true });

    try {
      const data = await StudentApi.getStudents(pageNumber, searchValue, sortString, sortOrder);
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

  handleSort = async e => {
    const {
      currentPage,
      searchAttr,
      searchAttr: { sortOrder }
    } = this.state;
    await this.setState({ searchAttr: { ...searchAttr, sortString: e.target.name, sortOrder: !sortOrder } });
    this.getStudentsByPage(currentPage);
  };

  renderHead() {
    const {
      searchAttr: { sortString, sortOrder }
    } = this.state;
    return (
      <thead>
        <tr>
          <th>
            <SortControl
              isSelected={sortString === "firstName"}
              isAsc={sortOrder}
              onClick={this.handleSort}
              name="firstName"
            >
              Name
            </SortControl>
          </th>
          <th style={{ width: 450 }}>
            <SortControl isSelected={sortString === "email"} isAsc={sortOrder} onClick={this.handleSort} name="email">
              Email
            </SortControl>
          </th>
          <th style={{ width: 70, fontWeight: "bold" }}>Gender</th>
          <th style={{ width: 150 }}>
            <SortControl
              isSelected={sortString === "dateOfBirth"}
              isAsc={sortOrder}
              onClick={this.handleSort}
              name="dateOfBirth"
            >
              Date of Birth
            </SortControl>
          </th>
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
        {!this.state.isLoading && !this.state.students.length && (
          <tr>
            <td colSpan="6">
              <h3 className="text-center">No Students...</h3>
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
        <ul className="pagination justify-content-center">
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
        <h1>
          <i className="fas fa-user-graduate mx-3" />
          Students
        </h1>
        <Link className="btn btn-primary my-3" to="students/create">
          New Students
        </Link>

        <form onSubmit={e => e.preventDefault()} className="form-inline flex-nowrap justify-content-end">
          <input
            className="form-control mr-2"
            name="searchValue"
            value={searchValue}
            placeholder="Search"
            onChange={this.handleFieldChange}
          />
          <button className="btn btn-outline-info my-2" type="submit" onClick={this.getStudentsByPage.bind(this, 1)}>
            <i className="fa fa-search" />
          </button>
        </form>

        {this.state.error && <Notification>{this.state.error}</Notification>}

        {this.state.isLoading && <Loader />}
        {!this.state.isLoading && !this.state.error && (
          <div className="table-responsive mt-2">
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
