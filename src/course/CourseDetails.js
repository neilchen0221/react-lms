import React from "react";

class CourseDetails extends React.Component {
  constructor() {
    super();
    this.state({
      isLoading: true,
      course: {
        title: "",
        fee: "",
        description: ""
      }
    });
  }

  async componentDidMount() {}

  render() {
    return (
      <div>
        <h1>New Course</h1>
        <form>
          <div>
            <label>Title</label>
            <input value={this.state.title} />
          </div>
          <div>
            <label>Fee</label>
            <input value={this.state.fee} />
          </div>
          <div>
            <select value={this.state.maxStudent}>
              <option>--Select--</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea value={this.state.description} />
          </div>
        </form>
      </div>
    );
  }
}

export default CourseDetails;
